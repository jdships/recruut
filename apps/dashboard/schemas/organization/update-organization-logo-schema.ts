import { z } from 'zod';

import { FileUploadAction } from '~/lib/file-upload';

export const updateOrganizationLogoSchema = z.object({
  action: z.nativeEnum(FileUploadAction),
  logo: z
    .string({
      invalid_type_error: 'Logo must be a string.'
    })
    .optional()
    .or(z.literal(''))
});

export type UpdateOrganizationLogoSchema = z.infer<
  typeof updateOrganizationLogoSchema
>;
