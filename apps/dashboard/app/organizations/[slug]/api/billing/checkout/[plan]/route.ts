/**
 * Dynamic Polar.sh checkout for specific plans
 * Accepts plan parameter and creates checkout for that plan
 */

import { Polar } from "@polar-sh/sdk";
import { getAuthOrganizationContext } from "@workspace/auth/context";
import { type NextRequest, NextResponse } from "next/server";
import { PLAN_CONFIGS, type PlanType } from "~/lib/plans";

const polar = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ plan: string }> },
) {
	try {
		const { plan } = await params;
		const { searchParams } = new URL(request.url);
		const interval = searchParams.get("interval") || "monthly"; // monthly or yearly

		// Validate plan
		if (!plan || !((plan as PlanType) in PLAN_CONFIGS)) {
			return NextResponse.json(
				{ error: "Invalid plan specified" },
				{ status: 400 },
			);
		}

		// Free plan doesn't need checkout
		if (plan === "free") {
			return NextResponse.json(
				{ error: "Free plan does not require checkout" },
				{ status: 400 },
			);
		}

		// Get user context
		const ctx = await getAuthOrganizationContext();
		if (!ctx.session.user || !ctx.organization) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const planConfig = PLAN_CONFIGS[plan as PlanType];
		const productId =
			planConfig.polarProductIds?.[interval as "monthly" | "yearly"];

		if (!productId) {
			return NextResponse.json(
				{ error: `Product ID not configured for ${plan} ${interval}` },
				{ status: 500 },
			);
		}

		// Create checkout session
		const checkoutSession = await polar.checkouts.create({
			products: [productId],
			customerEmail: ctx.session.user.email || undefined,
			customerName: ctx.session.user.name || undefined,
			// TODO: Add organization metadata
			metadata: {
				organizationId: ctx.organization.id,
				plan: plan,
				interval: interval,
			},
		});

		return NextResponse.json({
			checkoutUrl: checkoutSession.url,
			sessionId: checkoutSession.id,
		});
	} catch (error) {
		console.error("Checkout creation failed:", error);
		return NextResponse.json(
			{ error: "Failed to create checkout session" },
			{ status: 500 },
		);
	}
}
