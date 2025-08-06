import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { db, eq } from "@workspace/database/client";
import { organizationTable } from "@workspace/database/schema";
import { PLAN_CONFIGS, type PlanType } from "~/lib/plans";

import type { PlanStatusDto } from "~/types/dtos/plan-status-dto";

export async function getPlanStatus(): Promise<PlanStatusDto> {
	const ctx = await getAuthOrganizationContext();

	const [organization] = await db
		.select({
			plan: organizationTable.plan,
			planExpiresAt: organizationTable.planExpiresAt,
		})
		.from(organizationTable)
		.where(eq(organizationTable.id, ctx.organization.id))
		.limit(1);

	if (!organization) {
		// Default to free plan
		const freeConfig = PLAN_CONFIGS.free;
		return {
			currentPlan: "free",
			isActive: true,
			features: freeConfig.features,
			limits: freeConfig.limits,
		};
	}

	const currentPlan = organization.plan as PlanType;
	const planConfig = PLAN_CONFIGS[currentPlan];
	const isActive =
		!organization.planExpiresAt || organization.planExpiresAt > new Date();

	return {
		currentPlan,
		planExpiresAt: organization.planExpiresAt || undefined,
		isActive,
		features: planConfig.features,
		limits: planConfig.limits,
	};
}

// Legacy function name for compatibility - will be removed later
export async function getSubscription(): Promise<PlanStatusDto | undefined> {
	return getPlanStatus();
}
