'use server';

import { revalidateTag } from 'next/cache';

import { and, db, eq, inArray } from '@workspace/database/client';
import { contactImageTable, contactTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteContactsSchema } from '~/schemas/contacts/delete-contacts-schema';

export const deleteContacts = authOrganizationActionClient
  .metadata({ actionName: 'deleteContacts' })
  .inputSchema(deleteContactsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const contactIdsToDelete = parsedInput.ids;
    const organizationId = ctx.organization.id;

    await db.transaction(async (tx) => {
      await tx
        .delete(contactImageTable)
        .where(inArray(contactImageTable.contactId, contactIdsToDelete));

      await tx
        .delete(contactTable)
        .where(
          and(
            eq(contactTable.organizationId, organizationId),
            inArray(contactTable.id, contactIdsToDelete)
          )
        );
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Contacts,
        organizationId
      )
    );

    for (const id of parsedInput.ids) {
      revalidateTag(
        Caching.createOrganizationTag(OrganizationCacheKey.Contact, id)
      );
    }

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          organizationId,
          membership.userId
        )
      );
    }
  });
