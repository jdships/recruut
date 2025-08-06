import { z } from "zod";

export const reactivateOpportunitySchema = z.object({
	id: z.string().uuid(),
});

export type ReactivateOpportunitySchema = z.infer<
	typeof reactivateOpportunitySchema
>;
