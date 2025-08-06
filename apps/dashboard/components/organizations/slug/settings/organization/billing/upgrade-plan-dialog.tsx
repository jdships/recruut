"use client";

import NiceModal from "@ebay/nice-modal-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import * as React from "react";
import { getCurrentPlanAction } from "~/actions/billing/get-current-plan";
import { PlanSelection } from "~/components/organizations/slug/settings/organization/billing/plan-selection";
import { useEnhancedModal } from "~/hooks/use-enhanced-modal";

export const UpgradePlanDialog = NiceModal.create(() => {
	const modal = useEnhancedModal();
	const [currentPlan, setCurrentPlan] = React.useState<
		"free" | "pro" | "unlimited"
	>("free");
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchCurrentPlan = async () => {
			try {
				const result = await getCurrentPlanAction();
				if (result.success) {
					setCurrentPlan(result.plan);
				} else {
					setCurrentPlan("free");
				}
			} catch (error) {
				console.error("Failed to fetch current plan:", error);
				setCurrentPlan("free");
			} finally {
				setLoading(false);
			}
		};

		fetchCurrentPlan();
	}, []);

	if (loading) {
		return (
			<Dialog open={modal.visible}>
				<DialogContent
					className="max-w-full flex flex-col h-full rounded-none!"
					onClose={modal.handleClose}
					onAnimationEndCapture={modal.handleAnimationEndCapture}
				>
					<DialogHeader className="sr-only">
						<DialogTitle className="sr-only">Loading...</DialogTitle>
						<DialogDescription className="sr-only">
							Loading your current plan...
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center h-32">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
							<p className="text-sm text-muted-foreground">Loading...</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={modal.visible}>
			<DialogContent
				className="max-w-full flex flex-col h-full rounded-none!"
				onClose={modal.handleClose}
				onAnimationEndCapture={modal.handleAnimationEndCapture}
			>
				<DialogHeader className="sr-only">
					<DialogTitle className="sr-only">Upgrade your plan</DialogTitle>
					<DialogDescription className="sr-only">
						Select a plan below to upgrade.
					</DialogDescription>
				</DialogHeader>
				<PlanSelection title="Upgrade your plan" currentPlan={currentPlan} />
			</DialogContent>
		</Dialog>
	);
});
