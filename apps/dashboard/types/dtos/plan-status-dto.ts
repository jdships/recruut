/**
 * Simple plan status for the organization
 * This replaces the complex subscription DTO
 */
export type PlanStatusDto = {
	currentPlan: "free" | "pro" | "unlimited";
	planExpiresAt?: Date;
	isActive: boolean;
	features: string[];
	limits: {
		opportunities: number;
		applicationsPerMonth: number;
	};
};
