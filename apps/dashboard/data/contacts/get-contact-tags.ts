import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { db, eq } from '@workspace/database/client';
import {
  contactTable,
  contactTagTable,
  contactToContactTagTable
} from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { TagDto } from '~/types/dtos/tag-dto';

export async function getContactTags(): Promise<TagDto[]> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const contactTags = await db
        .selectDistinct({
          id: contactTagTable.id,
          text: contactTagTable.text
        })
        .from(contactTagTable)
        .innerJoin(
          contactToContactTagTable,
          eq(contactTagTable.id, contactToContactTagTable.contactTagId)
        )
        .innerJoin(
          contactTable,
          eq(contactToContactTagTable.contactId, contactTable.id)
        )
        .where(eq(contactTable.organizationId, ctx.organization.id))
        .orderBy(contactTagTable.text);

      return contactTags;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.ContactTags,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.ContactTags,
          ctx.organization.id
        ),
        Caching.createOrganizationTag(
          OrganizationCacheKey.Contacts,
          ctx.organization.id
        )
      ]
    }
  )();
}
