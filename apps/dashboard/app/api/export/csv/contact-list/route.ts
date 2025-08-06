import { NextRequest, NextResponse } from 'next/server';
import type { Column } from 'exceljs';
import { Workbook } from 'exceljs';

import { dedupedAuth } from '@workspace/auth';
import { checkSession } from '@workspace/auth/session';
import {
  and,
  count,
  db,
  eq,
  inArray,
  jsonAggBuildObject
} from '@workspace/database/client';
import {
  contactTable,
  contactTagTable,
  contactToContactTagTable,
  membershipTable
} from '@workspace/database/schema';

import { exportCsvContactListSchema } from '~/schemas/contacts/export-csv-contact-list-schema';

enum ContactColumn {
  Name = 'name',
  Email = 'email',
  Phone = 'phone',
  Address = 'address',
  Tags = 'tags'
}

const columns: Partial<Column>[] = [
  { header: 'Name', key: ContactColumn.Name },
  { header: 'Email', key: ContactColumn.Email },
  { header: 'Phone', key: ContactColumn.Phone },
  { header: 'Address', key: ContactColumn.Address },
  { header: 'Tags', key: ContactColumn.Tags }
];

type Row = {
  [ContactColumn.Name]: string;
  [ContactColumn.Email]: string;
  [ContactColumn.Phone]: string;
  [ContactColumn.Address]: string;
  [ContactColumn.Tags]: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const body = await req.json();
  const bodyParsingResult = exportCsvContactListSchema.safeParse(body);
  if (!bodyParsingResult.success) {
    return new NextResponse(JSON.stringify(bodyParsingResult.error.flatten()), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
  const parsedBody = bodyParsingResult?.data ?? {};

  const membershipCount = await db
    .select({ count: count() })
    .from(membershipTable)
    .where(
      and(
        eq(membershipTable.organizationId, parsedBody.organizationId),
        eq(membershipTable.userId, session.user.id)
      )
    );

  if (membershipCount[0].count === 0) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const records = await db
    .select({
      name: contactTable.name,
      email: contactTable.email,
      phone: contactTable.phone,
      address: contactTable.address,
      tags: jsonAggBuildObject({
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
    .where(
      and(
        eq(contactTable.organizationId, parsedBody.organizationId),
        parsedBody.ids ? inArray(contactTable.id, parsedBody.ids) : undefined
      )
    )
    .groupBy(contactTable.id);

  const now = new Date();
  const workbook = new Workbook();
  workbook.creator = session.user.name;
  workbook.lastModifiedBy = session.user.name;
  workbook.created = now;
  workbook.modified = now;
  const sheet = workbook.addWorksheet('Contact List');
  sheet.columns = columns;

  for (const record of records) {
    const row: Row = {
      [ContactColumn.Name]: record.name,
      [ContactColumn.Email]: record.email ?? '',
      [ContactColumn.Phone]: record.phone ?? '',
      [ContactColumn.Address]: record.address ?? '',
      [ContactColumn.Tags]: record.tags.map((t) => t.text).join(',')
    };
    sheet.addRow(row).commit();
  }

  const filename = 'contact-list.csv';
  const headers = new Headers();
  headers.append('Cache-Control', 'no-store');
  headers.append(
    'Content-Disposition',
    `attachment; filename=${filename}; filename*=UTF-8''${filename}`
  );
  headers.append('Content-Type', 'text/csv');

  const buffer = await workbook.csv.writeBuffer();

  return new NextResponse(buffer, {
    headers
  });
}
