import 'server-only';

import { cookies } from 'next/headers';

import { getAuthContext } from '@workspace/auth/context';
import { AuthCookies } from '@workspace/auth/cookies';
import { and, db, desc, eq, gt } from '@workspace/database/client';
import { sessionTable } from '@workspace/database/schema';

import type { SessionDto } from '~/types/dtos/session-dto';

export async function getSessions(): Promise<SessionDto[]> {
  const ctx = await getAuthContext();

  const cookieStore = await cookies();
  const currrentSessionToken =
    cookieStore.get(AuthCookies.SessionToken)?.value ?? '';

  const now = new Date();
  const sessions = await db
    .select({
      sessionToken: sessionTable.sessionToken,
      expires: sessionTable.expires
    })
    .from(sessionTable)
    .where(
      and(
        eq(sessionTable.userId, ctx.session.user.id),
        gt(sessionTable.expires, now)
      )
    )
    .orderBy(desc(sessionTable.expires));

  return sessions.map((s) => ({
    id: s.sessionToken,
    isCurrent: s.sessionToken === currrentSessionToken,
    expires: s.expires
  }));
}
