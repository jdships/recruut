'use server';

import { redirect } from 'next/navigation';

import { hashPassword } from '@workspace/auth/password';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import {
  resetPasswordRequestTable,
  userTable
} from '@workspace/database/schema';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { resetPasswordSchema } from '~/schemas/auth/reset-password-schema';

export const resetPassword = actionClient
  .metadata({ actionName: 'resetPassword' })
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const [maybeRequest] = await db
      .select({
        email: resetPasswordRequestTable.email
      })
      .from(resetPasswordRequestTable)
      .where(eq(resetPasswordRequestTable.id, parsedInput.requestId))
      .limit(1);

    if (!maybeRequest) {
      throw new NotFoundError('Reset password request not found');
    }

    const normalizedEmail = maybeRequest.email.toLowerCase();
    const [maybeUser] = await db
      .select({
        id: userTable.id
      })
      .from(userTable)
      .where(eq(userTable.email, normalizedEmail))
      .limit(1);

    if (!maybeUser) {
      throw new NotFoundError("Couldn't find an account for this email");
    }

    const now = new Date();
    const hashedPassword = await hashPassword(parsedInput.password);

    await db.transaction(async (tx) => {
      await tx
        .update(resetPasswordRequestTable)
        .set({ expires: now })
        .where(eq(resetPasswordRequestTable.id, parsedInput.requestId));

      await tx
        .update(userTable)
        .set({ password: hashedPassword })
        .where(eq(userTable.id, maybeUser.id));
    });

    return redirect(routes.dashboard.auth.resetPassword.Success);
  });
