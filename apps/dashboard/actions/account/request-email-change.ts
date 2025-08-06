'use server';

import { addHours } from 'date-fns';

import { EMAIL_CHANGE_EXPIRY_HOURS } from '@workspace/auth/constants';
import { PreConditionError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { changeEmailRequestTable, userTable } from '@workspace/database/schema';
import { sendConfirmEmailAddressChangeEmail } from '@workspace/email/send-confirm-email-address-change-email';
import { routes } from '@workspace/routes';

import { authActionClient } from '~/actions/safe-action';
import { requestEmailChangeSchema } from '~/schemas/account/request-email-change-schema';

export const requestEmailChange = authActionClient
  .metadata({ actionName: 'requestEmailChange' })
  .inputSchema(requestEmailChangeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const normalizedEmail = parsedInput.email.toLowerCase();
    const [user] = await db
      .select({})
      .from(userTable)
      .where(eq(userTable.email, normalizedEmail))
      .limit(1);

    if (user) {
      throw new PreConditionError('Email address is already taken');
    }

    const expires = addHours(new Date(), EMAIL_CHANGE_EXPIRY_HOURS);

    const requestId = await db.transaction(async (trx) => {
      await trx
        .update(changeEmailRequestTable)
        .set({ valid: false })
        .where(eq(changeEmailRequestTable.userId, ctx.session.user.id));

      const [{ id }] = await trx
        .insert(changeEmailRequestTable)
        .values({
          userId: ctx.session.user.id,
          email: normalizedEmail,
          valid: true,
          expires
        })
        .returning({ id: changeEmailRequestTable.id });

      return id;
    });

    await sendConfirmEmailAddressChangeEmail({
      recipient: normalizedEmail,
      name: ctx.session.user.name,
      confirmLink: `${routes.dashboard.auth.changeEmail.Request}/${requestId}`
    });
  });
