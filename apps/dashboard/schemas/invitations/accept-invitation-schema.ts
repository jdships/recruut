import { z } from 'zod';

export const acceptInvitationSchema = z.object({
  invitationId: z
    .string({
      required_error: 'Invitation id is required.',
      invalid_type_error: 'Invitation id must be a string.'
    })
    .trim()
    .uuid('Invitation id is invalid.')
    .min(1, 'Invitation id is required.')
    .max(36, 'Maximum 36 characters allowed.')
});

export type AcceptInvitationSchema = z.infer<typeof acceptInvitationSchema>;
