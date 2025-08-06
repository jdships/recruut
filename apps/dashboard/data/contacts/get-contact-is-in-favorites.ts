import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { favoriteTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey,
  UserCacheKey
} from '~/data/caching';
import {
  getContactIsInFavoritesSchema,
  type GetContactAddedToFavoritesSchema
} from '~/schemas/contacts/get-contact-is-in-favorites-schema';

export async function getContactIsInFavorites(
  input: GetContactAddedToFavoritesSchema
): Promise<boolean> {
  const ctx = await getAuthOrganizationContext();

  const result = getContactIsInFavoritesSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const [favorite] = await db
        .select({})
        .from(favoriteTable)
        .where(
          and(
            eq(favoriteTable.userId, ctx.session.user.id),
            eq(favoriteTable.contactId, parsedInput.contactId)
          )
        )
        .limit(1);

      return !!favorite;
    },
    Caching.createUserKeyParts(
      UserCacheKey.ContactIsInFavorites,
      ctx.session.user.id,
      parsedInput.contactId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createUserTag(
          UserCacheKey.ContactIsInFavorites,
          ctx.session.user.id,
          parsedInput.contactId
        ),
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          ctx.organization.id,
          ctx.session.user.id
        )
      ]
    }
  )();
}
