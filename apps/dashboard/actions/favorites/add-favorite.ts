'use server';

import { revalidateTag } from 'next/cache';

import { and, db, eq } from '@workspace/database/client';
import { favoriteTable } from '@workspace/database/schema';

import { updateFavoritesOrder } from '~/actions/favorites/_favorites-order';
import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { addFavoriteSchema } from '~/schemas/favorites/add-favorite-schema';

export const addFavorite = authOrganizationActionClient
  .metadata({ actionName: 'addFavorite' })
  .inputSchema(addFavoriteSchema)
  .action(async ({ parsedInput, ctx }) => {
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

    // Already added, return early
    if (favorite) {
      return;
    }

    // Perform the transaction
    await db.transaction(async (tx) => {
      // Delete existing favorites
      await tx
        .delete(favoriteTable)
        .where(
          and(
            eq(favoriteTable.userId, ctx.session.user.id),
            eq(favoriteTable.contactId, parsedInput.contactId)
          )
        );

      // Create a new favorite and set the order
      await tx.insert(favoriteTable).values({
        userId: ctx.session.user.id,
        contactId: parsedInput.contactId,
        order: (
          await db
            .select()
            .from(favoriteTable)
            .where(eq(favoriteTable.userId, ctx.session.user.id))
        ).length
      });

      // Update the order after insertion
      await updateFavoritesOrder(tx, ctx.session.user.id);
    });

    // Revalidate the cache
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
