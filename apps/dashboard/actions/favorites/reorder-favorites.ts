'use server';

import { revalidateTag } from 'next/cache';

import { db, eq } from '@workspace/database/client';
import { favoriteTable } from '@workspace/database/schema';

import { updateFavoritesOrder } from '~/actions/favorites/_favorites-order';
import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { reorderFavoritesSchema } from '~/schemas/favorites/reorder-favorites-schema';

export const reorderFavorites = authOrganizationActionClient
  .metadata({ actionName: 'reorderFavorites' })
  .inputSchema(reorderFavoritesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const favorites = await db
      .select({ id: favoriteTable.id })
      .from(favoriteTable)
      .where(eq(favoriteTable.userId, ctx.session.user.id));

    const updates = parsedInput.favorites
      .map((favoriteToUpdate) => {
        if (favorites.some((f) => f.id === favoriteToUpdate.id)) {
          return db
            .update(favoriteTable)
            .set({ order: favoriteToUpdate.order })
            .where(eq(favoriteTable.id, favoriteToUpdate.id));
        }
        return undefined;
      })
      .filter((update) => update !== undefined);

    if (updates.length > 0) {
      await db.transaction(async (tx) => {
        for (const update of updates) {
          await tx.execute(update);
        }
        await updateFavoritesOrder(tx, ctx.session.user.id);
      });

      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          ctx.organization.id,
          ctx.session.user.id
        )
      );
    }
  });
