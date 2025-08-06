import { cache } from 'react';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import { encode } from 'next-auth/jwt';

import { baseUrl, getPathname, routes } from '@workspace/routes';

import { keys } from '../keys';
import { adapter } from './adapter';
import { callbacks } from './callbacks';
import { events } from './events';
import { providers } from './providers';
import { session } from './session';

export const authConfig = {
  adapter,
  providers,
  secret: keys().AUTH_SECRET,
  session,
  pages: {
    signIn: getPathname(routes.dashboard.auth.SignIn, baseUrl.Dashboard),
    signOut: getPathname(routes.dashboard.auth.SignIn, baseUrl.Dashboard), // Don't need a sign out page
    error: getPathname(routes.dashboard.auth.Error, baseUrl.Dashboard), // Error code passed in query string as ?error=ERROR_CODE
    newUser: getPathname(routes.dashboard.onboarding.Index, baseUrl.Dashboard)
  },
  callbacks,
  events,
  jwt: {
    maxAge: session.maxAge,
    // Required line to encode credentials sessions
    async encode(arg) {
      return (arg.token?.sessionId as string) ?? encode(arg);
    }
  },
  trustHost: true
} satisfies NextAuthConfig;

// All those actions need to be called server-side
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// Deduplicated server-side auth call
export const dedupedAuth = cache(auth);
