import { z } from 'zod';

export const deleteOrganizationSchema = z.object({
  organizationName: z.string(),
  statement: z.coerce.boolean()
});

export type DeleteOrganizationSchema = z.infer<typeof deleteOrganizationSchema>;
