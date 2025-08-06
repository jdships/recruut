import { NextRequest, NextResponse } from 'next/server';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';
import { validate as uuidValidate } from 'uuid';

import { db, eq } from '@workspace/database/client';
import { organizationLogoTable } from '@workspace/database/schema';

const paramsCache = createSearchParamsCache({
  organizationId: parseAsString.withDefault('')
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<NextParams> }
): Promise<Response> {
  const { organizationId } = await paramsCache.parse(props.params);
  if (!uuidValidate(organizationId)) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const [organizationLogo] = await db.transaction(
    async (tx) =>
      await tx
        .select({
          data: organizationLogoTable.data,
          contentType: organizationLogoTable.contentType,
          hash: organizationLogoTable.hash
        })
        .from(organizationLogoTable)
        .where(eq(organizationLogoTable.organizationId, organizationId)),
    { isolationLevel: 'read uncommitted' }
  );

  if (!organizationLogo || !organizationLogo.data) {
    return new NextResponse(undefined, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const version = searchParams.get('v');
  if (version && version !== organizationLogo.hash) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  return new NextResponse(organizationLogo.data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': organizationLogo.contentType ?? 'image/png',
      'Content-Length': organizationLogo.data.length.toString()
    }
  });
}
