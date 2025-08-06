import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { and, asc, db, eq } from '@workspace/database/client';
import {
  contactNoteTable,
  contactTable,
  userTable
} from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import {
  getContactNotesSchema,
  type GetContactNotesSchema
} from '~/schemas/contacts/get-contact-notes-schema';
import type { ContactNoteDto } from '~/types/dtos/contact-note-dto';

export async function getContactNotes(
  input: GetContactNotesSchema
): Promise<ContactNoteDto[]> {
  const ctx = await getAuthOrganizationContext();

  const result = getContactNotesSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const contactNotes = await db
        .select({
          id: contactNoteTable.id,
          contactId: contactNoteTable.contactId,
          text: contactNoteTable.text,
          createdAt: contactNoteTable.createdAt,
          updatedAt: contactNoteTable.updatedAt,
          user: {
            id: userTable.id,
            name: userTable.name,
            image: userTable.image
          }
        })
        .from(contactNoteTable)
        .innerJoin(userTable, eq(contactNoteTable.userId, userTable.id))
        .innerJoin(
          contactTable,
          eq(contactNoteTable.contactId, contactTable.id)
        )
        .where(
          and(
            eq(contactTable.organizationId, ctx.organization.id),
            eq(contactNoteTable.contactId, parsedInput.contactId)
          )
        )
        .orderBy(asc(contactNoteTable.createdAt));

      const response: ContactNoteDto[] = contactNotes.map((note) => ({
        id: note.id,
        contactId: note.contactId,
        text: note.text ?? undefined,
        edited: note.createdAt.getTime() !== note.updatedAt.getTime(),
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        sender: {
          id: note.user.id,
          name: note.user.name,
          image: note.user.image ?? undefined
        }
      }));

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.ContactNotes,
      ctx.organization.id,
      parsedInput.contactId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.ContactNotes,
          ctx.organization.id,
          parsedInput.contactId
        ),
        Caching.createOrganizationTag(
          OrganizationCacheKey.Contact,
          ctx.organization.id,
          parsedInput.contactId
        ),
        Caching.createOrganizationTag(
          OrganizationCacheKey.Contacts,
          ctx.organization.id
        )
      ]
    }
  )();
}
