import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { and, asc, db, eq } from '@workspace/database/client';
import { contactTable, contactTaskTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import {
  getContactTasksSchema,
  type GetContactTasksSchema
} from '~/schemas/contacts/get-contact-tasks-schema';
import type { ContactTaskDto } from '~/types/dtos/contact-task-dto';

export async function getContactTasks(
  input: GetContactTasksSchema
): Promise<ContactTaskDto[]> {
  const ctx = await getAuthOrganizationContext();

  const result = getContactTasksSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const contactTasks = await db
        .select({
          id: contactTaskTable.id,
          contactId: contactTaskTable.contactId,
          title: contactTaskTable.title,
          description: contactTaskTable.description,
          status: contactTaskTable.status,
          dueDate: contactTaskTable.dueDate,
          createdAt: contactTaskTable.createdAt
        })
        .from(contactTaskTable)
        .innerJoin(
          contactTable,
          eq(contactTaskTable.contactId, contactTable.id)
        )
        .where(
          and(
            eq(contactTable.organizationId, ctx.organization.id),
            eq(contactTaskTable.contactId, parsedInput.contactId)
          )
        )
        .orderBy(asc(contactTaskTable.createdAt));

      const response: ContactTaskDto[] = contactTasks.map((task) => ({
        id: task.id,
        contactId: task.contactId ?? undefined,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status,
        dueDate: task.dueDate ?? undefined,
        createdAt: task.createdAt
      }));

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.ContactTasks,
      ctx.organization.id,
      parsedInput.contactId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.ContactTasks,
          ctx.organization.id,
          parsedInput.contactId
        )
      ]
    }
  )();
}
