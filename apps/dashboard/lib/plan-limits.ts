import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { and, count, db, eq, gte } from "@workspace/database/client";
import {
	applicationTable,
	opportunityTable,
	organizationTable,
} from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";

// Import the simplified plan types and configs from our new Polar integration
import { PLAN_CONFIGS, type PlanType } from "./plans";

// Plan limits derived from our simplified plan configs
export const PLAN_LIMITS = {
	free: {
		opportunities: PLAN_CONFIGS.free.limits.opportunities,
		applicationsPerMonth: PLAN_CONFIGS.free.limits.applicationsPerMonth,
		canInviteMembers: false,
		canCreateMultipleOrgs: false,
		customBranding: false,
	},
	pro: {
		opportunities: PLAN_CONFIGS.pro.limits.opportunities,
		applicationsPerMonth: PLAN_CONFIGS.pro.limits.applicationsPerMonth,
		canInviteMembers: false,
		canCreateMultipleOrgs: false,
		customBranding: false,
	},
	unlimited: {
		opportunities: PLAN_CONFIGS.unlimited.limits.opportunities,
		applicationsPerMonth: PLAN_CONFIGS.unlimited.limits.applicationsPerMonth,
		canInviteMembers: true,
		canCreateMultipleOrgs: true,
		customBranding: true,
	},
} as const;

/**
 * Cached function to get plan type for a specific organization
 * Now simply reads from the organizations.plan column
 */
const getCachedPlanType = cache(
	async (organizationId: string): Promise<PlanType> => {
		try {
			const [organization] = await db
				.select({
					plan: organizationTable.plan,
					planExpiresAt: organizationTable.planExpiresAt,
				})
				.from(organizationTable)
				.where(eq(organizationTable.id, organizationId))
				.limit(1);

			if (!organization) {
				return "free";
			}

			// Check if plan has expired
			if (
				organization.planExpiresAt &&
				organization.planExpiresAt < new Date()
			) {
				// Plan expired, should be reverted to free
				// The expiry checker will handle this, but return free for now
				return "free";
			}

			return organization.plan as PlanType;
		} catch {
			return "free";
		}
	},
	["plan-type"],
	{
		tags: ["plan-limits"],
		revalidate: 10, // Cache for 10 seconds for faster updates during development
	},
);

/**
 * Get the current user's plan type
 */
export async function getCurrentPlan(): Promise<PlanType> {
	try {
		const ctx = await getAuthOrganizationContext();
		return getCachedPlanType(ctx.organization.id);
	} catch {
		return "free";
	}
}

/**
 * Get plan limits for the current user
 */
export async function getPlanLimits() {
	const planType = await getCurrentPlan();
	return PLAN_LIMITS[planType];
}

/**
 * Cached function to get usage statistics for a specific organization
 */
const getCachedUsageStats = cache(
	async (organizationId: string) => {
		// Count opportunities
		const [opportunityCount] = await db
			.select({ count: count() })
			.from(opportunityTable)
			.where(eq(opportunityTable.organizationId, organizationId));

		// Count total applications across all opportunities
		const [totalApplications] = await db
			.select({ count: count() })
			.from(applicationTable)
			.innerJoin(
				opportunityTable,
				eq(applicationTable.opportunityId, opportunityTable.id),
			)
			.where(eq(opportunityTable.organizationId, organizationId));

		// Get applications per opportunity for the current month
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
					eq(opportunityTable.organizationId, organizationId),
					gte(applicationTable.createdAt, currentMonth),
				),
			);

		return {
			opportunities: opportunityCount?.count || 0,
			totalApplications: totalApplications?.count || 0,
			monthlyApplications: monthlyApplications?.count || 0,
		};
	},
	["usage-stats"],
	{
		tags: ["plan-usage", "opportunities", "applications"],
		revalidate: 60, // Cache for 1 minute
	},
);

/**
 * Get current usage statistics for the organization
 */
export async function getCurrentUsage() {
	const ctx = await getAuthOrganizationContext();
	return getCachedUsageStats(ctx.organization.id);
}

/**
 * Check if the user can create a new opportunity
 */
export async function canCreateOpportunity(): Promise<{
	allowed: boolean;
	reason?: string;
	limit?: number;
	current?: number;
}> {
	const limits = await getPlanLimits();
	const usage = await getCurrentUsage();

	if (limits.opportunities === Infinity) {
		return { allowed: true };
	}

	if (usage.opportunities >= limits.opportunities) {
		return {
			allowed: false,
			reason: `You've reached your plan limit of ${limits.opportunities} opportunities. Upgrade to create more.`,
			limit: limits.opportunities,
			current: usage.opportunities,
		};
	}

	return { allowed: true };
}

/**
 * Check if a specific opportunity can accept more applications
 * Uses monthly application limits per organization
 */
export async function canAcceptApplications(_opportunityId: string): Promise<{
	allowed: boolean;
	reason?: string;
	limit?: number;
	current?: number;
}> {
	const limits = await getPlanLimits();

	if (limits.applicationsPerMonth === Infinity) {
		return { allowed: true };
	}

	// Check if the organization has reached its monthly application limit
	const usage = await getCurrentUsage();

	if (usage.monthlyApplications >= limits.applicationsPerMonth) {
		return {
			allowed: false,
			reason: `Your organization has reached the monthly application limit of ${limits.applicationsPerMonth} applications. Upgrade your plan to receive more applications.`,
			limit: limits.applicationsPerMonth,
			current: usage.monthlyApplications,
		};
	}

	return { allowed: true };
}

/**
 * Check if the user can invite team members
 */
export async function canInviteMembers(): Promise<boolean> {
	const limits = await getPlanLimits();
	return limits.canInviteMembers;
}

/**
 * Check if the user can create multiple organizations
 * This checks the user's current plan in the active organization
 */
export async function canCreateMultipleOrganizations(): Promise<boolean> {
	try {
		const planType = await getCurrentPlan();
		const limits = PLAN_LIMITS[planType];
		return limits.canCreateMultipleOrgs;
	} catch (error) {
		console.error("Error checking multiple organization permissions:", error);
		return false; // Default to restricted on error
	}
}

/**
 * Check if the user has custom branding enabled
 */
export async function hasCustomBranding(): Promise<boolean> {
	const limits = await getPlanLimits();
	return limits.customBranding;
}

/**
 * Get usage percentage for opportunities
 */
export async function getOpportunityUsagePercentage(): Promise<number> {
	const limits = await getPlanLimits();
	const usage = await getCurrentUsage();

	if (limits.opportunities === Infinity) {
		return 0; // Unlimited plans show 0%
	}

	return Math.round((usage.opportunities / limits.opportunities) * 100);
}

/**
 * Get usage percentage for monthly applications
 */
export async function getApplicationUsagePercentage(): Promise<number> {
	const limits = await getPlanLimits();
	const usage = await getCurrentUsage();

	if (limits.applicationsPerMonth === Infinity) {
		return 0; // Unlimited plans show 0%
	}

	return Math.round(
		(usage.monthlyApplications / limits.applicationsPerMonth) * 100,
	);
}
