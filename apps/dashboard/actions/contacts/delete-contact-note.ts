'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { contactNoteTable, contactTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteContactNoteSchema } from '~/schemas/contacts/delete-contact-note-schema';

export const deleteContactNote = authOrganizationActionClient
  .metadata({ actionName: 'deleteContactNote' })
  .inputSchema(deleteContactNoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contactNote] = await db
      .select({
        contactId: contactNoteTable.contactId
      })
      .from(contactNoteTable)
      .innerJoin(contactTable, eq(contactNoteTable.contactId, contactTable.id))
      .where(
        and(
          eq(contactNoteTable.id, parsedInput.id),
          eq(contactTable.organizationId, ctx.organization.id)
        )
      )
      .limit(1);

    if (!contactNote) {
      throw new NotFoundError('Note not found');
    }

    await db
      .delete(contactNoteTable)
      .where(eq(contactNoteTable.id, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactNotes,
        ctx.organization.id,
        contactNote.contactId
      )
    );
  });
