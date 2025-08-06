'use server';

import { redirect } from 'next/navigation';
import { isAfter } from 'date-fns';

import { verifyEmail } from '@workspace/auth/verification';
import { APP_NAME } from '@workspace/common/app';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { userTable, verificationTokenTable } from '@workspace/database/schema';
import { sendWelcomeEmail } from '@workspace/email/send-welcome-email';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { verifyEmailWithTokenSchema } from '~/schemas/auth/verify-email-with-token-schema';

export const verifyEmailWithToken = actionClient
  .metadata({ actionName: 'verifyEmailWithToken' })
  .inputSchema(verifyEmailWithTokenSchema)
  .action(async ({ parsedInput }) => {
    const [verificationToken] = await db
      .select({
        identifier: verificationTokenTable.identifier,
        expires: verificationTokenTable.expires
      })
      .from(verificationTokenTable)
      .where(eq(verificationTokenTable.token, parsedInput.token))
      .limit(1);

    if (!verificationToken) {
      throw new NotFoundError('Verificaton token not found.');
    }

    const [user] = await db
      .select({
        name: userTable.name,
        email: userTable.email,
        emailVerified: userTable.emailVerified
      })
      .from(userTable)
      .where(eq(userTable.email, verificationToken.identifier))
      .limit(1);

    if (!user) {
      throw new NotFoundError('User not found.');
    }
    if (user.emailVerified) {
      return redirect(routes.dashboard.auth.verifyEmail.Success);
    }

    if (isAfter(new Date(), verificationToken.expires)) {
      return redirect(
        `${routes.dashboard.auth.verifyEmail.Expired}?email=${verificationToken.identifier}`
      );
    }

    await verifyEmail(verificationToken.identifier);

    await sendWelcomeEmail({
      appName: APP_NAME,
      name: user.name,
      recipient: user.email!,
      getStartedLink: routes.dashboard.organizations.Index
    });

    return redirect(routes.dashboard.auth.verifyEmail.Success);
  });
