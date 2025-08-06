import { createEnv } from "@t3-oss/env-nextjs";
import { keys as analytics } from "@workspace/analytics/keys";
import { keys as routes } from "@workspace/routes/keys";
import { z } from "zod";

export const env = createEnv({
	extends: [analytics(), routes()],
	server: {
		// Resend environment variables (optional for development)
		EMAIL_RESEND_API_KEY: z.string().min(1).optional(),
		EMAIL_FROM: z.string().email().optional(),
		RESEND_AUDIENCE_ID: z.string().min(1).optional(),
	},
	client: {},
	runtimeEnv: {
		EMAIL_RESEND_API_KEY: process.env.EMAIL_RESEND_API_KEY,
		EMAIL_FROM: process.env.EMAIL_FROM,
		RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
	},
});
