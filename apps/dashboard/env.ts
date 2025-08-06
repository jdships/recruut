import { createEnv } from "@t3-oss/env-nextjs";
import { keys as analytics } from "@workspace/analytics/keys";
import { keys as auth } from "@workspace/auth/keys";
import { keys as database } from "@workspace/database/keys";
import { keys as email } from "@workspace/email/keys";
import { keys as monitoring } from "@workspace/monitoring/keys";
import { keys as routes } from "@workspace/routes/keys";
import { z } from "zod";

export const env = createEnv({
	extends: [analytics(), auth(), database(), email(), monitoring(), routes()],
	server: {
		// Simple Polar.sh configuration
		POLAR_ACCESS_TOKEN: z.string().optional(),

		// Background jobs
		CRON_SECRET: z.string().optional(),
	},
	client: {},
	runtimeEnv: {
		POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
		CRON_SECRET: process.env.CRON_SECRET,
	},
});
