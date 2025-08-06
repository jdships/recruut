import { z } from 'zod';

import { OAuthProvider } from '@workspace/auth/providers.types';

export const connectAccountSchema = z.object({
  provider: z.nativeEnum(OAuthProvider, {
    required_error: 'Provider is required',
    invalid_type_error: 'Provider must be a string'
  })
});

export type ConnectAccountSchema = z.infer<typeof connectAccountSchema>;
