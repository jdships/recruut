import { Authenticator } from '@otplib/core';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto';
import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { isBefore, isValid } from 'date-fns';
import { type NextAuthConfig, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import MicrosoftEntraIdProvider from 'next-auth/providers/microsoft-entra-id';

import { db, eq } from '@workspace/database/client';
import { authenticatorAppTable, userTable } from '@workspace/database/schema';
import { inMemoryRateLimiter } from '@workspace/rate-limit/in-memory';

import { keys } from '../keys';
import { symmetricDecrypt, symmetricEncrypt } from './encryption';
import {
  IncorrectEmailOrPasswordError,
  IncorrectRecoveryCodeError,
  IncorrectTotpCodeError,
  InternalServerError,
  MissingRecoveryCodesError,
  RateLimitExceededError,
  RequestExpiredError,
  UnverifiedEmailError
} from './errors';
import { verifyPassword } from './password';
import { Provider } from './providers.types';
import {
  logInSchema,
  submitRecoveryCodeSchema,
  submitTotpCodeSchema
} from './schemas';

function checkRateLimitAndThrowError(uniqueIdentifier: string): void {
  // Built-in rate limiter to help manage traffic and prevent abuse.
  // Does not support serverless rate limiting, because the storage is in-memory.
  const limiter = inMemoryRateLimiter({
    intervalInMs: 60 * 1000 // 1 minute
  });
  const result = limiter.check(10, uniqueIdentifier); // 10 requests per minute
  if (result.isRateLimited) {
    throw new RateLimitExceededError();
  }
}

export const providers = [
  CredentialsProvider({
    id: Provider.Credentials,
    name: Provider.Credentials,
    credentials: {
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials) {
        console.error(`For some reason credentials are missing`);
        throw new InternalServerError();
      }

      if (!credentials.email || !credentials.password) {
        throw new IncorrectEmailOrPasswordError();
      }

      const result = logInSchema.safeParse(credentials);
      if (!result.success) {
        throw new IncorrectEmailOrPasswordError();
      }
      const parsedCredentials = result.data;

      const normalizedEmail = parsedCredentials.email.toLowerCase();
      checkRateLimitAndThrowError(normalizedEmail);

      const [user] = await db
        .select({
          id: userTable.id,
          password: userTable.password,
          email: userTable.email,
          emailVerified: userTable.emailVerified,
          name: userTable.name
        })
        .from(userTable)
        .where(eq(userTable.email, normalizedEmail))
        .limit(1);

      if (!user || !user.password || !user.email) {
        throw new IncorrectEmailOrPasswordError();
      }

      const isCorrectPassword = await verifyPassword(
        parsedCredentials.password,
        user.password
      );
      if (!isCorrectPassword) {
        throw new IncorrectEmailOrPasswordError();
      }

      if (!user.emailVerified || isBefore(new Date(), user.emailVerified)) {
        throw new UnverifiedEmailError();
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    }
  }),
  CredentialsProvider({
    id: Provider.TotpCode,
    name: Provider.TotpCode,
    credentials: {
      token: { label: 'Token', type: 'text' },
      totpCode: { label: 'TOTP code', type: 'text' }
    },
    async authorize(credentials) {
      if (!credentials) {
        console.error(`For some reason credentials are missing`);
        throw new InternalServerError();
      }

      if (!credentials.totpCode) {
        throw new IncorrectTotpCodeError();
      }

      const result = submitTotpCodeSchema.safeParse(credentials);
      if (!result.success) {
        throw new IncorrectTotpCodeError();
      }

      const key = keys().AUTH_SECRET;
      const parsedCredentials = result.data;
      const userId = symmetricDecrypt(parsedCredentials.token, key);
      const expiry = new Date(symmetricDecrypt(parsedCredentials.expiry, key));
      if (!isValid(expiry) || isBefore(expiry, new Date())) {
        throw new RequestExpiredError();
      }

      const [user] = await db
        .select({
          id: userTable.id,
          password: userTable.password,
          email: userTable.email,
          emailVerified: userTable.emailVerified,
          name: userTable.name
        })
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      if (!user || !user.email) {
        throw new InternalServerError();
      }

      checkRateLimitAndThrowError(user.email);

      const authenticatorApps = await db
        .select({
          secret: authenticatorAppTable.secret,
          recoveryCodes: authenticatorAppTable.recoveryCodes
        })
        .from(authenticatorAppTable)
        .where(eq(authenticatorAppTable.userId, user.id));

      if (authenticatorApps.length < 1) {
        throw new InternalServerError();
      }

      const secret = symmetricDecrypt(authenticatorApps[0].secret, key);
      if (secret.length !== 32) {
        console.error(
          `Authenticator app secret decryption failed. Expected key with length 32 but got ${secret.length}`
        );
        throw new InternalServerError();
      }

      const authenticator = new Authenticator({
        createDigest,
        createRandomBytes,
        keyDecoder,
        keyEncoder,
        window: [1, 0]
      });
      const isValidToken = authenticator.check(
        parsedCredentials.totpCode,
        secret
      );
      if (!isValidToken) {
        throw new IncorrectTotpCodeError();
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    }
  }),
  CredentialsProvider({
    id: Provider.RecoveryCode,
    name: Provider.RecoveryCode,
    credentials: {
      token: { label: 'Token', type: 'text' },
      recoveryCode: { label: 'Recovery code', type: 'text' }
    },
    async authorize(credentials) {
      if (!credentials) {
        console.error(`For some reason credentials are missing`);
        throw new InternalServerError();
      }

      if (!credentials.recoveryCode) {
        throw new IncorrectRecoveryCodeError();
      }

      const result = submitRecoveryCodeSchema.safeParse(credentials);
      if (!result.success) {
        throw new IncorrectRecoveryCodeError();
      }

      const key = keys().AUTH_SECRET;
      const parsedCredentials = result.data;
      const userId = symmetricDecrypt(parsedCredentials.token, key);
      const expiry = new Date(symmetricDecrypt(parsedCredentials.expiry, key));
      if (!isValid(expiry) || isBefore(expiry, new Date())) {
        throw new RequestExpiredError();
      }

      const [user] = await db
        .select({
          id: userTable.id,
          password: userTable.password,
          email: userTable.email,
          emailVerified: userTable.emailVerified,
          name: userTable.name
        })
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      if (!user || !user.email) {
        throw new InternalServerError();
      }

      checkRateLimitAndThrowError(user.email);

      const authenticatorApps = await db
        .select({
          recoveryCodes: authenticatorAppTable.recoveryCodes
        })
        .from(authenticatorAppTable)
        .where(eq(authenticatorAppTable.userId, user.id));

      if (authenticatorApps.length < 1) {
        throw new InternalServerError();
      }

      if (!authenticatorApps[0].recoveryCodes) {
        throw new MissingRecoveryCodesError();
      }

      const recoveryCodes = JSON.parse(
        symmetricDecrypt(authenticatorApps[0].recoveryCodes, key)
      );

      // Check if user-supplied code matches one
      const index = recoveryCodes.indexOf(
        parsedCredentials.recoveryCode.replaceAll('-', '')
      );
      if (index === -1) {
        throw new IncorrectRecoveryCodeError();
      }

      // Delete verified recoery code and re-encrypt remaining
      recoveryCodes[index] = null;
      await db
        .update(authenticatorAppTable)
        .set({
          recoveryCodes: symmetricEncrypt(JSON.stringify(recoveryCodes), key)
        })
        .where(eq(authenticatorAppTable.userId, user.id));

      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    }
  }),
  GoogleProvider({
    id: Provider.Google,
    name: Provider.Google,
    clientId: keys().AUTH_GOOGLE_CLIENT_ID!,
    clientSecret: keys().AUTH_GOOGLE_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
    authorization: {
      params: {
        scope: 'openid email profile',
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code'
      }
    }
  }),
  MicrosoftEntraIdProvider({
    id: Provider.MicrosoftEntraId,
    name: Provider.MicrosoftEntraId,
    clientId: keys().AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
    clientSecret: keys().AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
    token: {
      url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    },
    authorization: {
      url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      params: {
        scope: 'openid profile email offline_access User.Read'
      }
    },
    userinfo: { url: 'https://graph.microsoft.com/oidc/userinfo' },
    issuer: 'https://login.microsoftonline.com/common/v2.0',
    profile(profile) {
      // Removed the image fetching logic here, since it is unnecessary.
      // We really only want to fetch the image once during Events.signIn({ isNewUser })
      // and copy the image into our database.
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email
      } as User;
    }
  })
] satisfies NextAuthConfig['providers'];
