import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import {
  and,
  asc,
  count,
  db,
  desc,
  eq,
  exists,
  inArray,
  jsonAggBuildObject,
  sql
} from '@workspace/database/client';
import {
  ContactRecord,
  contactTable,
  contactTagTable,
  contactToContactTagTable
} from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import {
  getContactsSchema,
  RecordsOption,
  type GetContactsSchema
} from '~/schemas/contacts/get-contacts-schema';
import type { ContactDto } from '~/types/dtos/contact-dto';
import { SortDirection } from '~/types/sort-direction';

export async function getContacts(input: GetContactsSchema): Promise<{
  contacts: ContactDto[];
  filteredCount: number;
  totalCount: number;
}> {
  const ctx = await getAuthOrganizationContext();

  const result = getContactsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const whereClause = and(
        // Organization ID
        eq(contactTable.organizationId, ctx.organization.id),
        // Record Filter
        parsedInput.records === RecordsOption.People
          ? eq(contactTable.record, ContactRecord.PERSON)
          : parsedInput.records === RecordsOption.Companies
            ? eq(contactTable.record, ContactRecord.COMPANY)
            : undefined,
        // Tags Filter
        parsedInput.tags?.length
          ? exists(
              db
                .select({})
                .from(contactToContactTagTable)
                .innerJoin(
                  contactTagTable,
                  eq(contactToContactTagTable.contactTagId, contactTagTable.id)
                )
                .where(
                  and(
                    eq(contactToContactTagTable.contactId, contactTable.id),
                    inArray(contactTagTable.text, parsedInput.tags)
                  )
                )
            )
          : undefined,
        // Search query
        parsedInput.searchQuery
          ? sql`(${contactTable.name} ILIKE ${'%' + parsedInput.searchQuery + '%'} OR ${
              contactTable.email
            } ILIKE ${'%' + parsedInput.searchQuery + '%'})`
          : undefined
      );

      const [contacts, filteredCount, totalCount] = await Promise.all([
        db
          .select({
            id: contactTable.id,
            record: contactTable.record,
            image: contactTable.image,
            name: contactTable.name,
            email: contactTable.email,
            address: contactTable.address,
            phone: contactTable.phone,
            stage: contactTable.stage,
            createdAt: contactTable.createdAt,
            tags: jsonAggBuildObject({
              id: contactTagTable.id,
              text: contactTagTable.text
            })
          })
          .from(contactTable)
          .leftJoin(
            contactToContactTagTable,
            eq(contactTable.id, contactToContactTagTable.contactId)
          )
          .leftJoin(
            contactTagTable,
            eq(contactToContactTagTable.contactTagId, contactTagTable.id)
          )
          .where(whereClause)
          .groupBy(contactTable.id)
          .limit(parsedInput.pageSize)
          .offset(parsedInput.pageIndex * parsedInput.pageSize)
          .orderBy(getOrderBy(parsedInput.sortBy, parsedInput.sortDirection)),
        db
          .select({ count: count() })
          .from(contactTable)
          .where(whereClause)
          .then((res) => res[0].count),
        db
          .select({ count: count() })
          .from(contactTable)
          .where(eq(contactTable.organizationId, ctx.organization.id))
          .then((res) => res[0].count)
      ]);

      const response: ContactDto[] = contacts.map((contact) => ({
        id: contact.id,
        record: contact.record,
        image: contact.image ?? undefined,
        name: contact.name,
        email: contact.email ?? undefined,
        address: contact.address ?? undefined,
        phone: contact.phone ?? undefined,
        stage: contact.stage,
        createdAt: contact.createdAt,
        tags: contact.tags
      }));

      return { contacts: response, filteredCount, totalCount };
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Contacts,
      ctx.organization.id,
      parsedInput.pageIndex.toString(),
      parsedInput.pageSize.toString(),
      parsedInput.sortBy,
      parsedInput.sortDirection,
      parsedInput.tags?.join(',') ?? '',
      `records=${parsedInput.records}`,
      `searchQuery=${parsedInput.searchQuery ?? ''}`
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Contacts,
          ctx.organization.id
        )
      ]
    }
  )();
}

function getOrderBy(sortBy: string, sortDirection: SortDirection) {
  const direction = sortDirection === SortDirection.Asc ? asc : desc;

  switch (sortBy) {
    case 'name':
      return direction(contactTable.name);
    case 'email':
      return direction(contactTable.email);
    case 'address':
      return direction(contactTable.address);
    case 'phone':
      return direction(contactTable.phone);
    case 'stage':
      return direction(contactTable.stage);
    case 'createdAt':
      return direction(contactTable.createdAt);
    default:
      return direction(contactTable.name);
  }
}
