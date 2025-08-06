'use server';

import { revalidateTag } from 'next/cache';

import { db } from '@workspace/database/client';
import { contactCommentTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { addContactCommentSchema } from '~/schemas/contacts/add-contact-comment-schema';

export const addContactComment = authOrganizationActionClient
  .metadata({ actionName: 'addContactComment' })
  .inputSchema(addContactCommentSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.insert(contactCommentTable).values({
      contactId: parsedInput.contactId,
      text: parsedInput.text,
      userId: ctx.session.user.id
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactTimelineEvents,
        ctx.organization.id,
        parsedInput.contactId
      )
    );
  });
