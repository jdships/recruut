'use server';

import { revalidateTag } from 'next/cache';

import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';
import { updateMarketingEmailsSchema } from '~/schemas/account/update-marketing-email-settings';

export const updateMarketingEmails = authActionClient
  .metadata({ actionName: 'updateMarketingEmails' })
  .inputSchema(updateMarketingEmailsSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(userTable)
      .set({
        enabledNewsletter: parsedInput.enabledNewsletter,
        enabledProductUpdates: parsedInput.enabledProductUpdates
      })
      .where(eq(userTable.id, ctx.session.user.id));

    revalidateTag(
      Caching.createUserTag(UserCacheKey.MarketingEmails, ctx.session.user.id)
    );
  });
