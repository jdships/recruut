'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import {
  contactPageVisitTable,
  contactTable
} from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { addContactPageVisitSchema } from '~/schemas/contacts/add-contact-page-visit-schema';

export const addContactPageVisit = authOrganizationActionClient
  .metadata({ actionName: 'addContactPageVisit' })
  .inputSchema(addContactPageVisitSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contact] = await db
      .select({})
      .from(contactTable)
      .where(eq(contactTable.id, parsedInput.contactId))
      .limit(1);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    await db.insert(contactPageVisitTable).values({
      contactId: parsedInput.contactId,
      userId: ctx.session.user.id
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactPageVisits,
        ctx.organization.id
      )
    );
  });
