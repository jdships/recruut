'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { contactImageTable, contactTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteContactSchema } from '~/schemas/contacts/delete-contact-schema';

export const deleteContact = authOrganizationActionClient
  .metadata({ actionName: 'deleteContact' })
  .inputSchema(deleteContactSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contact] = await db
      .select({})
      .from(contactTable)
      .where(
        and(
          eq(contactTable.id, parsedInput.id),
          eq(contactTable.organizationId, ctx.organization.id)
        )
      )
      .limit(1);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(contactImageTable)
        .where(eq(contactImageTable.contactId, parsedInput.id));

      await tx.delete(contactTable).where(eq(contactTable.id, parsedInput.id));
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Contacts,
        ctx.organization.id
      )
    );

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Contact,
        ctx.organization.id,
        parsedInput.id
      )
    );

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          ctx.organization.id,
          membership.userId
        )
      );
    }
  });
