'use server';

import { revalidateTag } from 'next/cache';

import { db } from '@workspace/database/client';
import { contactNoteTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { addContactNoteSchema } from '~/schemas/contacts/add-contact-note-schema';

export const addContactNote = authOrganizationActionClient
  .metadata({ actionName: 'addContactNote' })
  .inputSchema(addContactNoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.insert(contactNoteTable).values({
      contactId: parsedInput.contactId,
      text: parsedInput.text ?? undefined,
      userId: ctx.session.user.id
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactNotes,
        ctx.organization.id,
        parsedInput.contactId
      )
    );
  });
