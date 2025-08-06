import { z } from "zod";

export const createOpportunitySchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title is too long"),
	description: z.string().max(2000, "Description is too long").optional(),
	positionLink: z.string().url("Must be a valid URL"),
	documents: z.array(z.string().url("Must be a valid URL")).optional(),
	hiringManagerEmail: z.string().email("Must be a valid email address"),
	moreContext: z.string().max(2000, "Too long").optional(),
});

export type CreateOpportunitySchema = z.infer<typeof createOpportunitySchema>;
