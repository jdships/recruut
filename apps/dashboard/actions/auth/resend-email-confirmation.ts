'use server';

import { createOtpTokens } from '@workspace/auth/verification';
import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';
import { sendVerifyEmailAddressEmail } from '@workspace/email/send-verify-email-address-email';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { resendEmailConfirmationSchema } from '~/schemas/auth/resend-email-confirmation-schema';

export const resendEmailConfirmation = actionClient
  .metadata({ actionName: 'resendEmailConfirmation' })
  .inputSchema(resendEmailConfirmationSchema)
  .action(async ({ parsedInput }) => {
    const normalizedEmail = parsedInput.email.toLowerCase();
    const [maybeUser] = await db
      .select({
        name: userTable.name,
        email: userTable.email,
        emailVerified: userTable.emailVerified
      })
      .from(userTable)
      .where(eq(userTable.email, normalizedEmail))
      .limit(1);

    if (!maybeUser || !maybeUser.email || maybeUser.emailVerified) {
      // Do not throw error or notify the user, we don't want to leak if a certain email exist
      return;
    }

    const { otp, hashedOtp } = await createOtpTokens(normalizedEmail);

    await sendVerifyEmailAddressEmail({
      recipient: maybeUser.email,
      name: maybeUser.name,
      otp,
      verificationLink: `${routes.dashboard.auth.verifyEmail.Request}/${hashedOtp}`
    });
  });
