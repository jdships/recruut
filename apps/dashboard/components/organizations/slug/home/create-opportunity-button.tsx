"use client";
import NiceModal from "@ebay/nice-modal-react";
import { IconCirclePlusFilled, IconSparkles } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { UpgradePlanDialog } from "~/components/organizations/slug/settings/organization/billing/upgrade-plan-dialog";
import type { OpportunityLimitsData } from "~/data/opportunities/get-opportunity-limits";
import { CreateOpportunityModal } from "./create-job-sheet";

export type CreateOpportunityButtonProps = {
	user: { id: string; name?: string; email?: string };
	limitsData: OpportunityLimitsData;
};

export function CreateOpportunityButton({
	user,
	limitsData,
}: CreateOpportunityButtonProps) {
	const handleShowModal = () => {
		if (limitsData.canCreate) {
			NiceModal.show(CreateOpportunityModal, { user });
		}
	};

	// Show upgrade button if limit reached
	if (!limitsData.canCreate) {
		return (
			<Button
				type="button"
				variant="primary"
				size="sm"
				onClick={() => NiceModal.show(UpgradePlanDialog)}
			>
				<IconSparkles className="size-4" />
				Upgrade
			</Button>
		);
	}

	return (
		<Button type="button" variant="default" size="sm" onClick={handleShowModal}>
			<IconCirclePlusFilled className="size-4" />
			New Opportunity
		</Button>
	);
}
