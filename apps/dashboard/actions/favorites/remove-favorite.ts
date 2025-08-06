'use server';

import { revalidateTag } from 'next/cache';

import { and, db, eq } from '@workspace/database/client';
import { favoriteTable } from '@workspace/database/schema';

import { updateFavoritesOrder } from '~/actions/favorites/_favorites-order';
import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { removeFavoriteSchema } from '~/schemas/favorites/remove-favorite-schema';

export const removeFavorite = authOrganizationActionClient
  .metadata({ actionName: 'removeFavorite' })
  .inputSchema(removeFavoriteSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.transaction(async (tx) => {
      await tx
        .delete(favoriteTable)
        .where(
          and(
            eq(favoriteTable.userId, ctx.session.user.id),
            eq(favoriteTable.contactId, parsedInput.contactId)
          )
        );

      await updateFavoritesOrder(tx, ctx.session.user.id);
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Favorites,
        ctx.organization.id,
        ctx.session.user.id
      )
    );

    revalidateTag(
      Caching.createUserTag(
        UserCacheKey.ContactIsInFavorites,
        ctx.session.user.id,
        parsedInput.contactId
      )
    );
  });
