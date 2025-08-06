import { z } from "zod";

export const sendRejectionEmailSchema = z.object({
	applicationIds: z
		.array(z.string().uuid())
		.min(1, "At least one application must be selected"),
});

export type SendRejectionEmailSchema = z.infer<typeof sendRejectionEmailSchema>;
