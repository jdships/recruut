import { z } from "zod";

export const deleteOpportunitySchema = z.object({
	id: z.string().uuid(),
});

export type DeleteOpportunitySchema = z.infer<typeof deleteOpportunitySchema>;
