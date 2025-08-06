"use server";

import { auth } from "@workspace/auth";
import { db, eq } from "@workspace/database/client";
import { membershipTable, organizationTable } from "@workspace/database/schema";
import { PLAN_LIMITS } from "~/lib/plan-limits";

export async function getUserPlanLimitsAction() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return { success: false, canCreateMultiple: false };
		}

		// Get all organizations the user is a member of
		const memberships = await db
			.select({
				organizationId: membershipTable.organizationId,
			})
			.from(membershipTable)
			.where(eq(membershipTable.userId, session.user.id));

		if (memberships.length === 0) {
			return { success: true, canCreateMultiple: false };
		}

		// Get all organizations with their plans
		const organizationIds = memberships.map((m) => m.organizationId);
		const organizations = await db
			.select({
				id: organizationTable.id,
				name: organizationTable.name,
				plan: organizationTable.plan,
				planExpiresAt: organizationTable.planExpiresAt,
			})
			.from(organizationTable)
			.where(eq(organizationTable.id, organizationIds[0])); // For now, just check the first org

		if (organizations.length === 0) {
			return { success: true, canCreateMultiple: false };
		}

		// Find the organization with the highest plan
		let highestPlan = "free";
		for (const org of organizations) {
			// Check if plan has expired
			if (org.planExpiresAt && org.planExpiresAt < new Date()) {
				continue; // Skip expired plans
			}

			// Determine plan hierarchy
			const planHierarchy = { free: 0, pro: 1, unlimited: 2 };
			const currentPlanLevel =
				planHierarchy[org.plan as keyof typeof planHierarchy] || 0;
			const highestPlanLevel =
				planHierarchy[highestPlan as keyof typeof planHierarchy] || 0;

			if (currentPlanLevel > highestPlanLevel) {
				highestPlan = org.plan;
			}
		}

		const limits = PLAN_LIMITS[highestPlan as keyof typeof PLAN_LIMITS];
		const canCreateMultiple = limits?.canCreateMultipleOrgs || false;

		return { success: true, canCreateMultiple };
	} catch (error) {
		console.error("Failed to get user plan limits:", error);
		return { success: false, canCreateMultiple: false };
	}
}
