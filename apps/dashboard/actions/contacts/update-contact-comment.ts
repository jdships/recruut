'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { contactCommentTable, contactTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateContactCommentSchema } from '~/schemas/contacts/update-contact-comment-schema';

export const updateContactComment = authOrganizationActionClient
  .metadata({ actionName: 'updateContactComment' })
  .inputSchema(updateContactCommentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contactComment] = await db
      .select({})
      .from(contactCommentTable)
      .innerJoin(
        contactTable,
        eq(contactCommentTable.contactId, contactTable.id)
      )
      .where(
        and(
          eq(contactTable.organizationId, ctx.organization.id),
          eq(contactCommentTable.id, parsedInput.id)
        )
      )
      .limit(1);

    if (!contactComment) {
      throw new NotFoundError('Contact comment not found');
    }

    const [comment] = await db
      .update(contactCommentTable)
      .set({ text: parsedInput.text })
      .where(eq(contactCommentTable.id, parsedInput.id))
      .returning({ contactId: contactCommentTable.contactId });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactTimelineEvents,
        ctx.organization.id,
        comment.contactId
      )
    );
  });
