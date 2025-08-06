import { NextResponse, type NextRequest } from 'next/server';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';
import { validate as uuidValidate } from 'uuid';

import { db, eq } from '@workspace/database/client';
import { contactImageTable } from '@workspace/database/schema';

const paramsCache = createSearchParamsCache({
  contactId: parseAsString.withDefault('')
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<NextParams> }
): Promise<Response> {
  const { contactId } = await paramsCache.parse(props.params);
  if (!contactId || !uuidValidate(contactId)) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const [contactImage] = await db.transaction(
    async (tx) =>
      await tx
        .select({
          data: contactImageTable.data,
          contentType: contactImageTable.contentType,
          hash: contactImageTable.hash
        })
        .from(contactImageTable)
        .where(eq(contactImageTable.contactId, contactId)),
    { isolationLevel: 'read uncommitted' }
  );

  if (!contactImage || !contactImage.data) {
    return new NextResponse(undefined, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const version = searchParams.get('v');
  if (version && version !== contactImage.hash) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  return new NextResponse(contactImage.data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': contactImage.contentType ?? 'image/png',
      'Content-Length': contactImage.data.length.toString()
    }
  });
}
