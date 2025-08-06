import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  locale: z
    .string({
      invalid_type_error: 'Locale must be a string.'
    })
    .trim()
    .max(8, 'Maximum 8 characters allowed.')
    .optional()
    .or(z.literal('')),
  theme: z.literal('light').or(z.literal('dark').or(z.literal('system')))
});

export type UpdatePreferencesSchema = z.infer<typeof updatePreferencesSchema>;
