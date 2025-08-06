'use server';

import { revalidateTag } from 'next/cache';

import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';
import { updateTransactionalEmailsSchema } from '~/schemas/account/update-transactional-emails-schema';

export const updateTransactionalEmails = authActionClient
  .metadata({ actionName: 'updateTransactionalEmails' })
  .inputSchema(updateTransactionalEmailsSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(userTable)
      .set({
        enabledContactsNotifications: parsedInput.enabledContactsNotifications,
        enabledInboxNotifications: parsedInput.enabledInboxNotifications,
        enabledWeeklySummary: parsedInput.enabledWeeklySummary
      })
      .where(eq(userTable.id, ctx.session.user.id));

    revalidateTag(
      Caching.createUserTag(
        UserCacheKey.TransactionalEmails,
        ctx.session.user.id
      )
    );
  });
