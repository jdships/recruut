"use server";

import { canCreateMultipleOrganizations } from "~/lib/plan-limits";

export async function getOrganizationLimitsAction() {
	try {
		const canCreateMultiple = await canCreateMultipleOrganizations();
		return { success: true, canCreateMultiple };
	} catch (error) {
		console.error("Failed to get organization limits:", error);
		return { success: false, canCreateMultiple: false };
	}
}
