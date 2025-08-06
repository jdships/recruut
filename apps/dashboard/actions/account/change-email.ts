'use server';

import { redirect } from 'next/navigation';
import { isAfter } from 'date-fns';

import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import {
  changeEmailRequestTable,
  sessionTable,
  userTable
} from '@workspace/database/schema';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { changeEmailSchema } from '~/schemas/account/change-email-schema';

export const changeEmail = actionClient
  .metadata({ actionName: 'changeEmail' })
  .inputSchema(changeEmailSchema)
  .action(async ({ parsedInput }) => {
    const [changeEmailRequest] = await db
      .select({
        userId: changeEmailRequestTable.userId,
        email: changeEmailRequestTable.email,
        valid: changeEmailRequestTable.valid,
        expires: changeEmailRequestTable.expires
      })
      .from(changeEmailRequestTable)
      .where(eq(changeEmailRequestTable.id, parsedInput.id))
      .limit(1);

    if (!changeEmailRequest) {
      throw new NotFoundError('Change email request not found');
    }

    if (!changeEmailRequest.valid) {
      return redirect(routes.dashboard.auth.changeEmail.Invalid);
    }

    if (isAfter(new Date(), changeEmailRequest.expires)) {
      return redirect(routes.dashboard.auth.changeEmail.Expired);
    }

    await db.transaction(async (trx) => {
      await trx
        .update(changeEmailRequestTable)
        .set({ valid: false })
        .where(eq(changeEmailRequestTable.id, parsedInput.id));
      await trx
        .delete(sessionTable)
        .where(eq(sessionTable.userId, changeEmailRequest.userId));
      await trx
        .update(userTable)
        .set({ email: changeEmailRequest.email })
        .where(eq(userTable.id, changeEmailRequest.userId));
    });
  });
