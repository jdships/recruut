import { z } from "zod";

export const sendInterviewRequestEmailSchema = z.object({
	applicationIds: z
		.array(z.string().uuid())
		.min(1, "At least one application must be selected"),
});

export type SendInterviewRequestEmailSchema = z.infer<
	typeof sendInterviewRequestEmailSchema
>;
