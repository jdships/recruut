import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { count, db, eq } from "@workspace/database/client";
import {
	opportunityTable,
	organizationTable,
} from "@workspace/database/schema";
import { PLAN_CONFIGS, type PlanType } from "~/lib/plans";

export type OpportunityLimitsData = {
	currentPlan: PlanType;
	isActive: boolean;
	opportunityLimit: number;
	currentOpportunityCount: number;
	canCreate: boolean;
};

/**
 * Get opportunity limits data efficiently in a single query
 * This replaces the slow API call pattern with server-side data fetching
 */
export async function getOpportunityLimits(): Promise<OpportunityLimitsData> {
	const ctx = await getAuthOrganizationContext();

	// Get organization plan and opportunity count in parallel
	const [organizationResult, opportunityCount] = await Promise.all([
		db
			.select({
				plan: organizationTable.plan,
				planExpiresAt: organizationTable.planExpiresAt,
			})
			.from(organizationTable)
			.where(eq(organizationTable.id, ctx.organization.id))
			.limit(1),
		db
			.select({ count: count() })
			.from(opportunityTable)
			.where(eq(opportunityTable.organizationId, ctx.organization.id))
			.then((result) => result[0]?.count ?? 0),
	]);

	const organization = organizationResult[0];
	const currentPlan: PlanType = organization?.plan ?? "free";

	// Check if plan is active (not expired)
	const isActive =
		!organization?.planExpiresAt || organization.planExpiresAt > new Date();
	const effectivePlan = isActive ? currentPlan : "free";

	const planConfig = PLAN_CONFIGS[effectivePlan];
	const opportunityLimit = planConfig.limits.opportunities;
	const canCreate =
		opportunityLimit === Infinity || opportunityCount < opportunityLimit;

	return {
		currentPlan: effectivePlan,
		isActive,
		opportunityLimit,
		currentOpportunityCount: opportunityCount,
		canCreate,
	};
}
