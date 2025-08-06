import { hasBasePath } from 'next/dist/client/has-base-path';
import { removeBasePath } from 'next/dist/client/remove-base-path';
import { workUnitAsyncStorage } from 'next/dist/server/app-render/work-unit-async-storage.external';
import { cookies } from 'next/headers';
import { addMinutes } from 'date-fns';

import { replaceOrgSlug, routes } from '@workspace/routes';

import { keys } from '../keys';
import { TOTP_AND_RECOVERY_CODES_EXPIRY_MINUTES } from './constants';
import { AuthCookies } from './cookies';
import { symmetricEncrypt } from './encryption';

export function getRedirectToSignIn(): string {
  const callbackUrl = getRequestStoragePathname();

  return callbackUrl
    ? `${routes.dashboard.Api}/auth/signin?${new URLSearchParams({ callbackUrl })}`
    : `${routes.dashboard.Api}/auth/signin`;
}

export async function getRedirectAfterSignIn(): Promise<string> {
  // Try to retrieve cookie stored slug
  const cookieStore = await cookies();
  const callbackUrl = cookieStore.get(AuthCookies.CallbackUrl)?.value;
  const slug = cookieStore.get('organizationSlug')?.value;

  const redirectTo = callbackUrl
    ? callbackUrl
    : slug
      ? replaceOrgSlug(routes.dashboard.organizations.slug.Home, slug)
      : routes.dashboard.organizations.Index;

  return redirectTo;
}

export function getRedirectToTotp(userId: string): string {
  const key = keys().AUTH_SECRET;
  const token = symmetricEncrypt(userId, key);
  const expiry = symmetricEncrypt(
    addMinutes(
      new Date(),
      TOTP_AND_RECOVERY_CODES_EXPIRY_MINUTES
    ).toISOString(),
    key
  );

  return `${routes.dashboard.auth.Totp}?token=${encodeURIComponent(token)}&expiry=${encodeURIComponent(expiry)}`;
}

export function getRequestStoragePathname(): string | null {
  const store = workUnitAsyncStorage.getStore();
  if (!store || store.type !== 'request') {
    return null;
  }

  const url = new URL(store.url.pathname + store.url.search, 'http://n');
  if (hasBasePath(url.pathname)) {
    return removeBasePath(url.pathname) + url.search;
  }

  return url.pathname + url.search;
}
