import { baseUrl } from '@workspace/routes';

const secure = new URL(baseUrl.Dashboard).protocol === 'https:';

export const AuthCookies = {
  CallbackUrl: secure ? '__Secure-authjs.callback-url' : 'authjs.callback-url',
  CsrfToken: secure ? '__Host-authjs.csrf-token' : 'authjs.csrf-token',
  SessionToken: secure
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token'
} as const;
