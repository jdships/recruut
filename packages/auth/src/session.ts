import { randomUUID } from 'crypto';
import { addSeconds } from 'date-fns';
import { type NextAuthConfig, type Session } from 'next-auth';
import { validate as uuidValidate } from 'uuid';

import type { Maybe } from '@workspace/common/maybe';
import {
  isDefined,
  isString,
  type IsDefinedGuard
} from '@workspace/common/type-guards';

export function checkSession(
  session: Maybe<Session>
): session is IsDefinedGuard<
  Session & {
    user: IsDefinedGuard<Session['user']> & {
      id: string;
      email: string;
      name: string;
    };
  }
> {
  // session
  if (!session) {
    // Normal behavior, no need to log a warning
    return false;
  }

  // session.user
  if (!session.user) {
    console.warn('No user found in the session. Unable to validate session.');
    return false;
  }

  // session.user.id
  if (!isDefined(session.user.id)) {
    console.warn('User ID is undefined. Validation failed.');
    return false;
  }
  if (!uuidValidate(session.user.id)) {
    console.warn('Invalid user ID format. Expected a UUID.');
    return false;
  }

  // session.user.email
  if (!isDefined(session.user.email)) {
    console.warn(`User ${session.user.id} has an undefined email.`);
    return false;
  }
  if (!isString(session.user.email)) {
    console.warn(
      `Invalid email type for user ${session.user.id}. Expected a string.`
    );
    return false;
  }

  // session.user.name
  if (!isDefined(session.user.name)) {
    console.warn(`User ${session.user.id} has an undefined name.`);
    return false;
  }
  if (!isString(session.user.name)) {
    console.warn(
      `Invalid name type for user ${session.user.id}. Expected a string.`
    );
    return false;
  }

  return true;
}

export function generateSessionToken(): string {
  return randomUUID();
}

export function getSessionExpiryFromNow(): Date {
  return addSeconds(Date.now(), session.maxAge);
}

export const session = {
  strategy: 'database',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
  generateSessionToken
} satisfies NextAuthConfig['session'];
