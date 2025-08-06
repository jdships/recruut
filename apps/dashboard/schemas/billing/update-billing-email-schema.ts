import { z } from 'zod';

export const updateBillingEmailSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
      invalid_type_error: 'Email must be a string.'
    })
    .trim()
    .max(255, 'Maximum 255 characters allowed.')
    .email('Enter a valid email address.')
    .optional()
    .or(z.literal(''))
});

export type UpdateBillingEmailSchema = z.infer<typeof updateBillingEmailSchema>;
