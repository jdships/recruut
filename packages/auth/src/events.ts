import { createHash } from 'crypto';
import type { Account, NextAuthConfig, Profile, User } from 'next-auth';

import { APP_NAME } from '@workspace/common/app';
import { resizeImage } from '@workspace/common/image';
import { and, count, db, eq, isNull } from '@workspace/database/client';
import {
  accountTable,
  sessionTable,
  userImageTable,
  userTable
} from '@workspace/database/schema';
import { sendConnectedAccountSecurityAlertEmail } from '@workspace/email/send-connected-account-security-alert-email';
import { sendWelcomeEmail } from '@workspace/email/send-welcome-email';
import { baseUrl, getUserImageUrl, routes } from '@workspace/routes';

import { OAuthProvider } from './providers.types';
import { verifyEmail } from './verification';

export const events = {
  async signIn({ user, account, profile, isNewUser }) {
    if (user && user.id) {
      await db
        .update(userTable)
        .set({ lastLogin: new Date() })
        .where(eq(userTable.id, user.id));

      if (isNewUser && user.email) {
        if (account?.provider === OAuthProvider.Google) {
          await verifyEmail(user.email);
          await tryCopyGoogleImage(user, profile);
          if (user.name) {
            await sendWelcomeEmail({
              recipient: user.email!,
              appName: APP_NAME,
              name: user.name,
              getStartedLink: routes.dashboard.organizations.Index
            });
          }
        }
        if (account?.provider === OAuthProvider.MicrosoftEntraId) {
          await verifyEmail(user.email);
          await tryCopyMicrosoftGraphImage(user, account);
          if (user.name) {
            await sendWelcomeEmail({
              recipient: user.email!,
              appName: APP_NAME,
              name: user.name,
              getStartedLink: routes.dashboard.organizations.Index
            });
          }
        }
      }
    }
  },
  async signOut(message) {
    if ('session' in message && message.session?.sessionToken) {
      await db
        .delete(sessionTable)
        .where(eq(sessionTable.sessionToken, message.session.sessionToken));
    }
  },
  async linkAccount({ user, account }) {
    if (user && user.name && user.email && account && account.provider) {
      // Here we check if the user just has been created using an OAuth provider
      // - If yes -> No need to send out security alert
      // - If no (which means linked using an existing account) -> Send out security alert

      const [newUser] = await db
        .select({
          userId: userTable.id,
          email: userTable.email,
          lastLogin: userTable.lastLogin,
          accountCount: count(accountTable.id)
        })
        .from(userTable)
        .leftJoin(accountTable, eq(accountTable.userId, userTable.id))
        .where(
          and(eq(userTable.email, user.email), isNull(userTable.lastLogin))
        )
        .groupBy(userTable.id)
        .limit(1);

      const isNewUser = newUser && newUser.accountCount < 2;
      if (!isNewUser) {
        try {
          await sendConnectedAccountSecurityAlertEmail({
            recipient: user.email,
            appName: APP_NAME,
            name: user.name,
            action: 'connected',
            provider: account.provider
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
} satisfies NextAuthConfig['events'];

type ResizedImage = {
  bytes?: Buffer;
  contentType?: string;
  hash?: string;
};

async function fetchAndResizeRemoteImage(url?: string): Promise<ResizedImage> {
  let bytes: Buffer | undefined;
  let contentType: string | undefined;
  let hash: string | undefined;

  if (url) {
    try {
      if (new URL(url).origin === new URL(baseUrl.Dashboard).origin) {
        throw Error('Cannot fetch images from the same origin. Security risk.');
      }

      const response = await fetch(url);
      if (response.ok) {
        const mimeType = response.headers.get('content-type');
        if (mimeType) {
          const jsBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(new Uint8Array(jsBuffer));
          bytes = await resizeImage(buffer, mimeType);
          if (bytes) {
            contentType = mimeType;
            hash = createHash('sha256').update(bytes).digest('hex');
          }
        }
      } else {
        console.warn(`Failed to fetch image from ${url}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    bytes,
    contentType,
    hash
  };
}

async function tryCopyGoogleImage(
  user: User,
  profile?: Profile
): Promise<void> {
  try {
    if (profile?.picture) {
      const image = await fetchAndResizeRemoteImage(profile.picture);
      if (image.bytes && image.contentType && image.hash) {
        const imageUrl = getUserImageUrl(user.id!, image.hash);
        await db.transaction(async (tx) => {
          await tx.insert(userImageTable).values({
            userId: user.id!,
            data: image.bytes,
            contentType: image.contentType,
            hash: image.hash
          });
          await tx
            .update(userTable)
            .set({ image: imageUrl })
            .where(eq(userTable.id, user.id!));
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function tryCopyMicrosoftGraphImage(
  user: User,
  account: Account
): Promise<void> {
  try {
    const profilePhotoSize = 96;
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
      { headers: { Authorization: `Bearer ${account.access_token}` } }
    );

    if (response.ok) {
      const mimeType = response.headers.get('content-type');
      if (mimeType) {
        const jsBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(new Uint8Array(jsBuffer));
        const bytes = await resizeImage(buffer, mimeType);
        const contentType = mimeType;
        const hash = createHash('sha256').update(bytes).digest('hex');
        if (bytes && contentType && hash) {
          const imageUrl = getUserImageUrl(user.id!, hash);
          await db.transaction(async (tx) => {
            await tx.insert(userImageTable).values({
              userId: user.id!,
              data: bytes,
              contentType: contentType,
              hash: hash
            });
            await tx
              .update(userTable)
              .set({ image: imageUrl })
              .where(eq(userTable.id, user.id!));
          });
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
