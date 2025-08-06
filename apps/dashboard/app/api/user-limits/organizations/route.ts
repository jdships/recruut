import { getAuthOrganizationContext } from "@workspace/auth/context";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
	canCreateMultipleOrganizations,
	getCurrentPlan,
} from "~/lib/plan-limits";

export async function GET() {
	try {
		// Force revalidation of plan limits cache
		revalidateTag("plan-limits");

		// Debug: Get the current organization context
		const ctx = await getAuthOrganizationContext();
		console.log("DEBUG /api/user-limits/organizations:");
		console.log("  - Active org ID:", ctx.organization.id);
		console.log("  - Active org name:", ctx.organization.name);
		console.log("  - Active org plan:", ctx.organization.plan);

		// Debug: Get the current plan
		const currentPlan = await getCurrentPlan();
		console.log("  - Detected plan:", currentPlan);

		const canCreateMultiple = await canCreateMultipleOrganizations();
		console.log("  - Can create multiple:", canCreateMultiple);

		return NextResponse.json({ canCreateMultiple });
	} catch (error) {
		console.error("Error checking user organization limits:", error);
		return NextResponse.json(
			{ canCreateMultiple: false }, // Default to restricted on error
			{ status: 500 },
		);
	}
}
