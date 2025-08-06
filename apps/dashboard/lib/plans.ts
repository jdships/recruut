/**
 * Simple plan configuration for Recruut
 * No complex abstraction - just what we need for 3 simple plans
 */

export const PLANS = {
	FREE: "free",
	PRO: "pro",
	UNLIMITED: "unlimited",
} as const;

export type PlanType = (typeof PLANS)[keyof typeof PLANS];

export type PlanConfig = {
	id: PlanType;
	name: string;
	description: string;
	price: {
		monthly: number;
		yearly: number;
	};
	features: string[];
	limits: {
		opportunities: number;
		applicationsPerMonth: number;
	};
	// Polar product IDs - to be set when creating products in Polar dashboard
	polarProductIds?: {
		monthly?: string;
		yearly?: string;
	};
};

/**
 * Simple plan definitions
 */
export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
	[PLANS.FREE]: {
		id: PLANS.FREE,
		name: "Free",
		description: "Get started with basic recruiting",
		price: {
			monthly: 0,
			yearly: 0,
		},
		features: [
			"1 Opportunity",
			"10 Applications per month",
			"Basic analytics",
			"Single user only",
		],
		limits: {
			opportunities: 1,
			applicationsPerMonth: 10,
		},
		// No Polar product needed for free plan
	},

	[PLANS.PRO]: {
		id: PLANS.PRO,
		name: "Pro",
		description: "Scale your recruiting with advanced features",
		price: {
			monthly: 29,
			yearly: 290, // 10 months price
		},
		features: [
			"3 Opportunities",
			"50 Applications per month",
			"Advanced analytics",
			"Email integrations",
			"Team collaboration",
		],
		limits: {
			opportunities: 3,
			applicationsPerMonth: 50,
		},
		polarProductIds: {
			// These will be set after creating products in Polar dashboard
			// monthly: 'polar_product_id_pro_monthly',
			// yearly: 'polar_product_id_pro_yearly',
		},
	},

	[PLANS.UNLIMITED]: {
		id: PLANS.UNLIMITED,
		name: "Unlimited",
		description: "Unlimited recruiting power for growing teams",
		price: {
			monthly: 59,
			yearly: 590, // 10 months price
		},
		features: [
			"Unlimited Opportunities",
			"Unlimited Applications",
			"Advanced analytics",
			"Email integrations",
			"Team collaboration",
			"Priority support",
			"API access",
		],
		limits: {
			opportunities: Infinity,
			applicationsPerMonth: Infinity,
		},
		polarProductIds: {
			// These will be set after creating products in Polar dashboard
			// monthly: 'polar_product_id_unlimited_monthly',
			// yearly: 'polar_product_id_unlimited_yearly',
		},
	},
};

/**
 * Helper to get plan config by ID
 */
export function getPlanConfig(planId: PlanType): PlanConfig {
	return PLAN_CONFIGS[planId];
}

/**
 * Helper to check if user has reached plan limits
 */
export function hasReachedLimit(
	planId: PlanType,
	type: "opportunities" | "applicationsPerMonth",
	currentCount: number,
): boolean {
	const config = getPlanConfig(planId);
	const limit = config.limits[type];

	if (limit === Infinity) return false;
	return currentCount >= limit;
}

/**
 * Helper to get upgrade suggestions
 */
export function getUpgradeSuggestion(currentPlan: PlanType): PlanType | null {
	switch (currentPlan) {
		case PLANS.FREE:
			return PLANS.PRO;
		case PLANS.PRO:
			return PLANS.UNLIMITED;
		case PLANS.UNLIMITED:
			return null; // Already on highest plan
		default:
			return PLANS.PRO;
	}
}
