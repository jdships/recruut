"use client";

import NiceModal from "@ebay/nice-modal-react";
import { Banner } from "@workspace/ui/components/banner";
import { UpgradePlanDialog } from "~/components/organizations/slug/settings/organization/billing/upgrade-plan-dialog";

export function BannerWithUpgradeModal({ expiry }: { expiry: Date | null }) {
	return (
		<Banner
			expiry={expiry}
			onClaimOffer={() => NiceModal.show(UpgradePlanDialog)}
		/>
	);
}
