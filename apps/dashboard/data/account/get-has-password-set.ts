import 'server-only';

import { getAuthContext } from '@workspace/auth/context';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';

export async function getHasPasswordSet(): Promise<boolean> {
  const ctx = await getAuthContext();

  const [userFromDb] = await db
    .select({
      password: userTable.password
    })
    .from(userTable)
    .where(eq(userTable.id, ctx.session.user.id))
    .limit(1);

  if (!userFromDb) {
    throw new NotFoundError('User not found.');
  }

  return !!userFromDb.password;
}
