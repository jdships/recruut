import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      MONITORING_SENTRY_ORG: z.string().optional(),
      MONITORING_SENTRY_PROJECT: z.string().optional(),
      MONITORING_SENTRY_AUTH_TOKEN: z.string().optional()
    },
    client: {
      NEXT_PUBLIC_MONITORING_SENTRY_DSN: z.string().optional()
    },
    runtimeEnv: {
      MONITORING_SENTRY_ORG: process.env.MONITORING_SENTRY_ORG,
      MONITORING_SENTRY_PROJECT: process.env.MONITORING_SENTRY_PROJECT,
      MONITORING_SENTRY_AUTH_TOKEN: process.env.MONITORING_SENTRY_AUTH_TOKEN,
      NEXT_PUBLIC_MONITORING_SENTRY_DSN:
        process.env.NEXT_PUBLIC_MONITORING_SENTRY_DSN
    }
  });
