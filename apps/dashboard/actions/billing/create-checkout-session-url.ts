"use server";

import { NotFoundError } from "@workspace/common/errors";
import { z } from "zod";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { PLAN_CONFIGS } from "~/lib/plans";

export const createCheckoutSessionUrl = authOrganizationActionClient
	.metadata({ actionName: "createCheckoutSessionUrl" })
	.inputSchema(
		z.object({
			plan: z.enum(["pro", "unlimited"]),
			interval: z.enum(["monthly", "yearly"]).default("monthly"),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const { plan, interval } = parsedInput;

		// Validate plan exists
		if (!(plan in PLAN_CONFIGS)) {
			throw new NotFoundError("Plan not found");
		}

		// Create checkout URL by calling our API route
		const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
		const checkoutUrl = `${baseUrl}/organizations/${ctx.organization.slug}/api/billing/checkout/${plan}?interval=${interval}`;

		// Make a POST request to our checkout API
		const response = await fetch(checkoutUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Add any auth headers if needed
			},
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to create checkout session");
		}

		const { checkoutUrl: polarCheckoutUrl } = await response.json();

		return {
			url: polarCheckoutUrl,
		};
	});
