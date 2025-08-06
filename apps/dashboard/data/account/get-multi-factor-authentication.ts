import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthContext } from '@workspace/auth/context';
import { db, eq } from '@workspace/database/client';
import { authenticatorAppTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  UserCacheKey
} from '~/data/caching';
import type { MultiFactorAuthenticationDto } from '~/types/dtos/multi-factor-authentication-dto';

export async function getMultiFactorAuthentication(): Promise<MultiFactorAuthenticationDto> {
  const ctx = await getAuthContext();

  return cache(
    async () => {
      const [authenticatorApp] = await db
        .select({
          id: authenticatorAppTable.id,
          accountName: authenticatorAppTable.accountName,
          issuer: authenticatorAppTable.issuer,
          createdAt: authenticatorAppTable.createdAt
        })
        .from(authenticatorAppTable)
        .where(eq(authenticatorAppTable.userId, ctx.session.user.id))
        .limit(1);

      const response: MultiFactorAuthenticationDto = {
        authenticatorApp: authenticatorApp ?? undefined
      };

      return response;
    },
    Caching.createUserKeyParts(
      UserCacheKey.MultiFactorAuthentication,
      ctx.session.user.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createUserTag(
          UserCacheKey.MultiFactorAuthentication,
          ctx.session.user.id
        )
      ]
    }
  )();
}
