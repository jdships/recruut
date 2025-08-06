"use server";

import { getCurrentPlan } from "~/lib/plan-limits";

export async function getCurrentPlanAction() {
	try {
		const plan = await getCurrentPlan();
		return { success: true, plan };
	} catch (error) {
		console.error("Failed to get current plan:", error);
		return { success: false, plan: "free" as const };
	}
} 