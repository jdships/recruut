import { z } from 'zod';

import { Role } from '@workspace/database/schema';

export const sendInvitationSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
      invalid_type_error: 'Email must be a string.'
    })
    .trim()
    .min(1, 'Email is required.')
    .max(255, 'Maximum 255 characters allowed.')
    .email('Enter a valid email address.'),
  role: z.nativeEnum(Role, {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be a string'
  })
});

export type SendInvitationSchema = z.infer<typeof sendInvitationSchema>;
