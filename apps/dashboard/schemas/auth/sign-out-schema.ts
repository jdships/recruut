import { z } from 'zod';

export const signOutSchema = z.object({
  redirect: z.coerce.boolean()
});

export type SignOutSchema = z.infer<typeof signOutSchema>;
