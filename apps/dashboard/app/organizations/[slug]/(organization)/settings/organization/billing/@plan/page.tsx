import type * as React from "react";

import { PlanDetails } from "~/components/organizations/slug/settings/organization/billing/plan-details";
import { getPlanStatus } from "~/data/billing/get-subscription";

export default async function PlanPage(): Promise<React.JSX.Element> {
	const planStatus = await getPlanStatus();

	return (
		<PlanDetails
			currentPlan={planStatus.currentPlan}
			planExpiresAt={planStatus.planExpiresAt}
			isActive={planStatus.isActive}
		/>
	);
}
