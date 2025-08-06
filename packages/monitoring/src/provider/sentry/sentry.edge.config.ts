import { init } from '@sentry/nextjs';

import { keys } from '../../../keys';

type Parameters<T extends (args: never) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

export function initializeSentryEdgeClient(
  props: Parameters<typeof init>[0] = {}
) {
  return init({
    dsn: keys().NEXT_PUBLIC_MONITORING_SENTRY_DSN,
    integrations: [
      // https://docs.sentry.io/platforms/javascript/configuration/integrations/
    ],
    tracesSampleRate: props?.tracesSampleRate ?? 1.0,
    ...props
  });
}
