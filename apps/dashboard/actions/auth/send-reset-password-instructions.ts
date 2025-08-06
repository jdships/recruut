'use server';

import { addHours } from 'date-fns';

import { PASSWORD_RESET_EXPIRY_HOURS } from '@workspace/auth/constants';
import { APP_NAME } from '@workspace/common/app';
import { and, db, eq, gt } from '@workspace/database/client';
import {
  resetPasswordRequestTable,
  userTable
} from '@workspace/database/schema';
import { sendPasswordResetEmail } from '@workspace/email/send-password-reset-email';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { sendResetPasswordInstructionsSchema } from '~/schemas/auth/send-reset-password-instructions-schema';

export const sendResetPasswordInstructions = actionClient
  .metadata({ actionName: 'sendResetPasswordInstructions' })
  .inputSchema(sendResetPasswordInstructionsSchema)
  .action(async ({ parsedInput }) => {
    const normalizedEmail = parsedInput.email.toLowerCase();
    const [maybeUser] = await db
      .select({
        name: userTable.name,
        email: userTable.email
      })
      .from(userTable)
      .where(eq(userTable.email, normalizedEmail))
      .limit(1);

    if (!maybeUser || !maybeUser.email) {
      // Don't leak information about whether an email is registered or not
      return;
    }

    const now = new Date();

    const maybePreviousRequests = await db
      .select({
        id: resetPasswordRequestTable.id
      })
      .from(resetPasswordRequestTable)
      .where(
        and(
          eq(resetPasswordRequestTable.email, maybeUser.email),
          gt(resetPasswordRequestTable.expires, now)
        )
      );

    let passwordRequestId: string;

    if (maybePreviousRequests.length >= 1) {
      passwordRequestId = maybePreviousRequests[0].id;
    } else {
      const expires = addHours(new Date(), PASSWORD_RESET_EXPIRY_HOURS);
      const [createdResetPasswordRequest] = await db
        .insert(resetPasswordRequestTable)
        .values({
          email: maybeUser.email,
          expires
        })
        .returning({ id: resetPasswordRequestTable.id });
      passwordRequestId = createdResetPasswordRequest.id;
    }

    await sendPasswordResetEmail({
      recipient: maybeUser.email,
      appName: APP_NAME,
      name: maybeUser.name,
      resetPasswordLink: `${routes.dashboard.auth.resetPassword.Request}/${passwordRequestId}`
    });
  });
