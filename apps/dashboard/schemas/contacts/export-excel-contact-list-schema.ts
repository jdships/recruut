import { z } from 'zod';

export const exportExcelContactListSchema = z.object({
  organizationId: z
    .string({
      required_error: 'Organization id is required.',
      invalid_type_error: 'Organization id must be a string.'
    })
    .trim()
    .uuid('Organization id is invalid.')
    .min(1, 'Organization id is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  ids: z.array(
    z
      .string({
        required_error: 'Id is required.',
        invalid_type_error: 'Id must be a string.'
      })
      .trim()
      .uuid('Id is invalid.')
      .min(1, 'Id is required.')
      .max(36, 'Maximum 36 characters allowed.')
  )
});

export type ExportExcelContactListSchema = z.infer<
  typeof exportExcelContactListSchema
>;
