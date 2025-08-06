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
import type { PreferencesDto } from '~/types/dtos/preferences-dto';

export async function getPreferences(): Promise<PreferencesDto> {
  const ctx = await getAuthContext();

  return cache(
    async () => {
      const [userFromDb] = await db
        .select({
          locale: userTable.locale
        })
        .from(userTable)
        .where(eq(userTable.id, ctx.session.user.id))
        .limit(1);

      if (!userFromDb) {
        throw new NotFoundError('User not found');
      }

      const response: PreferencesDto = {
        locale: userFromDb.locale
      };

      return response;
    },
    Caching.createUserKeyParts(UserCacheKey.Preferences, ctx.session.user.id),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createUserTag(UserCacheKey.Preferences, ctx.session.user.id)
      ]
    }
  )();
}
