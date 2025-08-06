'use server';

import { revalidateTag } from 'next/cache';

import { db } from '@workspace/database/client';
import { contactTaskTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { addContactTaskSchema } from '~/schemas/contacts/add-contact-task-schema';

export const addContactTask = authOrganizationActionClient
  .metadata({ actionName: 'addContactTask' })
  .inputSchema(addContactTaskSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.insert(contactTaskTable).values({
      contactId: parsedInput.contactId,
      title: parsedInput.title,
      description: parsedInput.description,
      status: parsedInput.status,
      dueDate: parsedInput.dueDate ? parsedInput.dueDate : null
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactTasks,
        ctx.organization.id,
        parsedInput.contactId
      )
    );
  });
