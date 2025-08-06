'use server';

import { revalidateTag } from 'next/cache';

import { PreConditionError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { authenticatorAppTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';

export const disableAuthenticatorApp = authActionClient
  .metadata({ actionName: 'disableAuthenticatorApp' })
  .action(async ({ ctx }) => {
    const [authenticatorApp] = await db
      .select({})
      .from(authenticatorAppTable)
      .where(eq(authenticatorAppTable.userId, ctx.session.user.id))
      .limit(1);

    if (!authenticatorApp) {
      throw new PreConditionError('Authenticator app is not enabled');
    }

    await db
      .delete(authenticatorAppTable)
      .where(eq(authenticatorAppTable.userId, ctx.session.user.id));

    revalidateTag(
      Caching.createUserTag(
        UserCacheKey.MultiFactorAuthentication,
        ctx.session.user.id
      )
    );
  });
