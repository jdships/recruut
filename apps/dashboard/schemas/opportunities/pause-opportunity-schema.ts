import { z } from "zod";

export const pauseOpportunitySchema = z.object({
	id: z.string().uuid(),
});

export type PauseOpportunitySchema = z.infer<typeof pauseOpportunitySchema>;
