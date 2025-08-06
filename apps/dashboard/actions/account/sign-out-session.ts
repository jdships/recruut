'use server';

import { cookies } from 'next/headers';

import { signOut } from '@workspace/auth';
import { AuthCookies } from '@workspace/auth/cookies';
import { and, db, eq } from '@workspace/database/client';
import { sessionTable } from '@workspace/database/schema';
import { routes } from '@workspace/routes';

import { authActionClient } from '~/actions/safe-action';
import { signOutSessionSchema } from '~/schemas/account/sign-out-session-schema';

export const signOutSession = authActionClient
  .metadata({ actionName: 'signOutSession' })
  .inputSchema(signOutSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [sessionFromDb] = await db
      .select({
        sessionToken: sessionTable.sessionToken
      })
      .from(sessionTable)
      .where(
        and(
          eq(sessionTable.userId, ctx.session.user.id),
          eq(sessionTable.sessionToken, parsedInput.sessionToken)
        )
      )
      .limit(1);

    if (sessionFromDb) {
      const cookieStore = await cookies();
      const currentSessionToken =
        cookieStore.get(AuthCookies.SessionToken)?.value ?? '';
      if (
        currentSessionToken &&
        sessionFromDb.sessionToken === currentSessionToken
      ) {
        return await signOut({
          redirect: true,
          redirectTo: routes.dashboard.auth.SignIn
        });
      } else {
        await db
          .delete(sessionTable)
          .where(
            and(
              eq(sessionTable.userId, ctx.session.user.id),
              eq(sessionTable.sessionToken, parsedInput.sessionToken)
            )
          );
      }
    }
  });
