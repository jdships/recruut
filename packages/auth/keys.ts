import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      AUTH_SECRET: z.string(),
      AUTH_GOOGLE_CLIENT_ID: z.string().optional(),
      AUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string().optional(),
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string().optional()
    },
    runtimeEnv: {
      AUTH_SECRET: process.env.AUTH_SECRET,
      AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
      AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID:
        process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET:
        process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET
    }
  });
