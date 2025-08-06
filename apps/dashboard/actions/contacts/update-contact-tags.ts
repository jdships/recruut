'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { contactTable } from '@workspace/database/schema';

import { updateContactAndCaptureEvent } from '~/actions/contacts/_contact-event-capture';
import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateContactTagsSchema } from '~/schemas/contacts/update-contact-tags-schema';

export const updateContactTags = authOrganizationActionClient
  .metadata({ actionName: 'updateContactTags' })
  .inputSchema(updateContactTagsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contact] = await db
      .select({})
      .from(contactTable)
      .where(
        and(
          eq(contactTable.organizationId, ctx.organization.id),
          eq(contactTable.id, parsedInput.id)
        )
      )
      .limit(1);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }
    await updateContactAndCaptureEvent(
      parsedInput.id,
      {
        tags: parsedInput.tags
      },
      ctx.session.user.id
    );

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
  });
