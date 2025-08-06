'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { contactTable, contactTaskTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteContactTaskSchema } from '~/schemas/contacts/delete-contact-task-schema';

export const deleteContactTask = authOrganizationActionClient
  .metadata({ actionName: 'deleteContactTask' })
  .inputSchema(deleteContactTaskSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contactTask] = await db
      .select({ contactId: contactTaskTable.contactId })
      .from(contactTaskTable)
      .innerJoin(contactTable, eq(contactTaskTable.contactId, contactTable.id))
      .where(
        and(
          eq(contactTable.organizationId, ctx.organization.id),
          eq(contactTaskTable.id, parsedInput.id)
        )
      )
      .limit(1);

    if (!contactTask) {
      throw new NotFoundError('Task not found');
    }

    await db
      .delete(contactTaskTable)
      .where(eq(contactTaskTable.id, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.ContactTasks,
        ctx.organization.id,
        contactTask.contactId
      )
    );
  });
