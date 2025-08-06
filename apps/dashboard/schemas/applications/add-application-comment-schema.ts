import { z } from "zod";

export const addApplicationCommentSchema = z.object({
	applicationId: z.string().uuid("Invalid application ID"),
	text: z
		.string()
		.min(1, "Comment text is required")
		.max(2000, "Comment text is too long"),
});

export type AddApplicationCommentSchema = z.infer<
	typeof addApplicationCommentSchema
>;
