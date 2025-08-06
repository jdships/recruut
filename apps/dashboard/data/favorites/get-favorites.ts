import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { and, asc, db, eq } from '@workspace/database/client';
import { contactTable, favoriteTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { FavoriteDto } from '~/types/dtos/favorite-dto';

export async function getFavorites(): Promise<FavoriteDto[]> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const favorites = await db
        .select({
          id: favoriteTable.id,
          order: favoriteTable.order,
          contact: {
            id: contactTable.id,
            name: contactTable.name,
            record: contactTable.record,
            image: contactTable.image
          }
        })
        .from(favoriteTable)
        .innerJoin(contactTable, eq(favoriteTable.contactId, contactTable.id))
        .where(
          and(
            eq(contactTable.organizationId, ctx.organization.id),
            eq(favoriteTable.userId, ctx.session.user.id)
          )
        )
        .orderBy(asc(favoriteTable.order));

      const response: FavoriteDto[] = favorites.map((favorite) => ({
        id: favorite.id,
        order: favorite.order,
        contactId: favorite.contact.id,
        name: favorite.contact.name,
        record: favorite.contact.record,
        image: favorite.contact.image ? favorite.contact.image : undefined
      }));

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Favorites,
      ctx.organization.id,
      ctx.session.user.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          ctx.organization.id,
          ctx.session.user.id
        )
      ]
    }
  )();
}
