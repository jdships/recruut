import { getAuthOrganizationContext } from "@workspace/auth/context";
import { replaceOrgSlug, routes } from "@workspace/routes";
import { redirect } from "next/navigation";
import type * as React from "react";

import { PlanSelection } from "~/components/organizations/slug/settings/organization/billing/plan-selection";
import { getCurrentPlan } from "~/lib/plan-limits";

export default async function ChoosePlanPage(): Promise<React.JSX.Element> {
	const ctx = await getAuthOrganizationContext();
	const currentPlan = await getCurrentPlan();

	// If they already have a paid plan, redirect to billing settings
	if (currentPlan !== "free") {
		return redirect(
			replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.organization.Billing,
				ctx.organization.slug,
			),
		);
	}

	return (
		<PlanSelection
			title="Choose your plan"
			backLink={routes.dashboard.organizations.Index}
			currentPlan={currentPlan}
		/>
	);
}
