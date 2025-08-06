import { z } from 'zod';

export const updateOrganizationSlugSchema = z.object({
  slug: z
    .string({
      required_error: 'Slug is required.',
      invalid_type_error: 'Slug must be a string.'
    })
    .trim()
    .min(3, 'Minimum 3 characters required.')
    .max(1024, 'Maximum 1024 characters allowed.')
    .regex(/^[a-z0-9]+[a-z0-9_-]*[a-z0-9]+$/, {
      message:
        'Slug must start and end with a letter or number and can contain underscores and hyphens in between.'
    })
});

export type UpdateOrganizationSlugSchema = z.infer<
  typeof updateOrganizationSlugSchema
>;
