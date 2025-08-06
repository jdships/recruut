'use server';

import { revalidateTag } from 'next/cache';

import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';
import { updatePreferencesSchema } from '~/schemas/account/update-preferences-schema';

export const updatePreferences = authActionClient
  .metadata({ actionName: 'updatePreferences' })
  .inputSchema(updatePreferencesSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(userTable)
      .set({ locale: parsedInput.locale })
      .where(eq(userTable.id, ctx.session.user.id));

    revalidateTag(
      Caching.createUserTag(UserCacheKey.Preferences, ctx.session.user.id)
    );
  });
