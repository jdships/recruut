'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { contactNoteTable, contactTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateContactCommentSchema } from '~/schemas/contacts/update-contact-comment-schema';

export const updateContactNote = authOrganizationActionClient
  .metadata({ actionName: 'updateContactNote' })
  .inputSchema(updateContactCommentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contactNote] = await db
      .select({})
      .from(contactNoteTable)
      .innerJoin(contactTable, eq(contactNoteTable.contactId, contactTable.id))
      .where(
        and(
          eq(contactTable.organizationId, ctx.organization.id),
          eq(contactNoteTable.id, parsedInput.id)
        )
      )
      .limit(1);

    if (!contactNote) {
      throw new NotFoundError('Contact not not found');
    }

    await db
      .update(contactNoteTable)
      .set({ text: parsedInput.text })
      .where(eq(contactNoteTable.id, parsedInput.id))
      .returning({ contactId: contactNoteTable.contactId });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactNotes,
        ctx.organization.id,
        parsedInput.id
      )
    );
  });
