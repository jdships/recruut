import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
	createEnv({
		client: {
			NEXT_PUBLIC_DASHBOARD_URL: z.string().min(1).url(),
			NEXT_PUBLIC_MARKETING_URL: z.string().min(1).url(),
			NEXT_PUBLIC_AGENT_URL: z.string().min(1).url(),
		},
		runtimeEnv: {
			NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
			NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
			NEXT_PUBLIC_AGENT_URL: process.env.NEXT_PUBLIC_AGENT_URL,
		},
	});
