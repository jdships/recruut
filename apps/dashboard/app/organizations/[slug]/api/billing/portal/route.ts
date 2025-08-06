/**
 * Simple Polar.sh customer portal
 * Redirects users to manage their subscription
 */

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		// Get user context
		const ctx = await getAuthOrganizationContext();
		if (!ctx.session.user || !ctx.organization) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// If no billing customer ID, they haven't made any purchases yet
		if (!ctx.organization.billingCustomerId) {
			return NextResponse.json(
				{ error: "No active subscription found" },
				{ status: 400 },
			);
		}

		// Create customer portal session
		// Note: This is a simplified implementation
		// You might need to adjust based on Polar's actual customer portal API
		const portalUrl = `https://app.polar.sh/customers/${ctx.organization.billingCustomerId}`;

		return NextResponse.json({
			portalUrl: portalUrl,
		});
	} catch (error) {
		console.error("Portal creation failed:", error);
		return NextResponse.json(
			{ error: "Failed to create portal session" },
			{ status: 500 },
		);
	}
}
