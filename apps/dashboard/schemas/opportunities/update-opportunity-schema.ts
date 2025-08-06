import { z } from "zod";

export const updateOpportunitySchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	positionLink: z.string().url().optional(),
	documents: z.array(z.string().url()).optional(),
	hiringManagerEmail: z.string().email().optional(),
	moreContext: z.string().optional(),
});

export type UpdateOpportunitySchema = z.infer<typeof updateOpportunitySchema>;
