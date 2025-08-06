import { NextResponse, type NextRequest } from 'next/server';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';
import { validate as uuidValidate } from 'uuid';

import { db, eq } from '@workspace/database/client';
import { userImageTable } from '@workspace/database/schema';

const paramsCache = createSearchParamsCache({
  userId: parseAsString.withDefault('')
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<NextParams> }
): Promise<Response> {
  const { userId } = await paramsCache.parse(props.params);
  if (!userId || !uuidValidate(userId)) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const [userImage] = await db.transaction(
    async (tx) =>
      await tx
        .select({
          data: userImageTable.data,
          contentType: userImageTable.contentType,
          hash: userImageTable.hash
        })
        .from(userImageTable)
        .where(eq(userImageTable.userId, userId)),
    { isolationLevel: 'read uncommitted' }
  );

  if (!userImage || !userImage.data) {
    return new NextResponse(undefined, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const version = searchParams.get('v');
  if (version && version !== userImage.hash) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  return new NextResponse(userImage.data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': userImage.contentType ?? 'image/png',
      'Content-Length': userImage.data.length.toString()
    }
  });
}
