import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthContext } from '@workspace/auth/context';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  UserCacheKey
} from '~/data/caching';
import type { MarketingEmailsDto } from '~/types/dtos/marketing-emails-dto';

export async function getMarketingEmailSettings(): Promise<MarketingEmailsDto> {
  const ctx = await getAuthContext();

  return cache(
    async () => {
      const [userFromDb] = await db
        .select({
          enabledNewsletter: userTable.enabledNewsletter,
          enabledProductUpdates: userTable.enabledProductUpdates
        })
        .from(userTable)
        .where(eq(userTable.id, ctx.session.user.id))
        .limit(1);

      if (!userFromDb) {
        throw new NotFoundError('User not found');
      }

      const response: MarketingEmailsDto = {
        enabledNewsletter: userFromDb.enabledNewsletter,
        enabledProductUpdates: userFromDb.enabledProductUpdates
      };

      return response;
    },
    Caching.createUserKeyParts(
      UserCacheKey.MarketingEmails,
      ctx.session.user.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createUserTag(UserCacheKey.MarketingEmails, ctx.session.user.id)
      ]
    }
  )();
}
