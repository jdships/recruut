import "server-only";

import { and, count, db, eq, gte } from "@workspace/database/client";
import {
	applicationTable,
	opportunityTable,
	organizationTable,
} from "@workspace/database/schema";

// Plan limits for monthly applications (simplified Polar integration)
export const APPLICATION_LIMITS = {
	free: 10,
	pro: 50,
	unlimited: Infinity,
} as const;

export type PlanType = "free" | "pro" | "unlimited";

/**
 * Check if an opportunity can accept more applications based on its plan limits
 * Now checks monthly application limits per organization
 */
export async function canAcceptApplications(opportunityId: string): Promise<{
	allowed: boolean;
	reason?: string;
	limit?: number;
	current?: number;
}> {
	try {
		// Get opportunity details with organization plan info
		const [result] = await db
			.select({
				organizationId: opportunityTable.organizationId,
				status: opportunityTable.status,
				plan: organizationTable.plan,
				planExpiresAt: organizationTable.planExpiresAt,
			})
			.from(opportunityTable)
			.innerJoin(
				organizationTable,
				eq(opportunityTable.organizationId, organizationTable.id),
			)
			.where(eq(opportunityTable.id, opportunityId))
			.limit(1);

		if (!result) {
			return {
				allowed: false,
				reason: "Opportunity not found",
			};
		}

		if (result.status === "paused") {
			return {
				allowed: false,
				reason:
					"This opportunity is currently paused and not accepting new applications",
			};
		}

		// Check if plan has expired
		let currentPlan: PlanType = result.plan as PlanType;
		if (result.planExpiresAt && result.planExpiresAt < new Date()) {
			currentPlan = "free"; // Expired plans default to free
		}

		// Get the monthly application limit
		const monthlyLimit = APPLICATION_LIMITS[currentPlan];

		if (monthlyLimit === Infinity) {
			return { allowed: true };
		}

		// Count applications for this organization in the current month
		const currentMonth = new Date();
		currentMonth.setDate(1);
		currentMonth.setHours(0, 0, 0, 0);

		const [monthlyApplications] = await db
			.select({ count: count() })
			.from(applicationTable)
			.innerJoin(
				opportunityTable,
				eq(applicationTable.opportunityId, opportunityTable.id),
			)
			.where(
				and(
					eq(opportunityTable.organizationId, result.organizationId),
					gte(applicationTable.createdAt, currentMonth),
				),
			);

		const currentCount = monthlyApplications?.count ?? 0;

		if (currentCount >= monthlyLimit) {
			return {
				allowed: false,
				reason: `This organization has reached its monthly application limit of ${monthlyLimit} applications. Please upgrade to receive more applications.`,
				limit: monthlyLimit,
				current: currentCount,
			};
		}

		return {
			allowed: true,
			limit: monthlyLimit,
			current: currentCount,
		};
	} catch (error) {
		console.error("Error checking submission limits:", error);
		// Default to allowing submissions if check fails to avoid blocking legitimate applications
		return {
			allowed: true,
		};
	}
}
