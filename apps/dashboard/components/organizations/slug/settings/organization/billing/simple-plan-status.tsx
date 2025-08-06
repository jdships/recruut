"use client";

import NiceModal from "@ebay/nice-modal-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { CheckIcon, ExternalLinkIcon, Sparkles } from "lucide-react";
import { PLAN_CONFIGS, type PlanType } from "~/lib/plans";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";

type Props = {
	currentPlan: PlanType;
	planExpiresAt?: Date;
	isActive: boolean;
	className?: string;
};

export function SimplePlanStatus({
	currentPlan,
	planExpiresAt,
	isActive,
	className,
}: Props) {
	const planConfig = PLAN_CONFIGS[currentPlan];
	const showUpgradeOptions = currentPlan === "free";

	const handleManageBilling = () => {
		// Call our simple portal API
		fetch("../api/billing/portal", { method: "POST" })
			.then((res) => res.json())
			.then((data) => {
				if (data.portalUrl) {
					window.open(data.portalUrl, "_blank");
				}
			})
			.catch((error) => {
				console.error("Failed to open portal:", error);
			});
	};

	const handleUpgrade = () => {
		NiceModal.show(UpgradePlanDialog);
	};

	return (
		<div className={className}>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								Current Plan: {planConfig.name}
								{!isActive && <Badge variant="destructive">Expired</Badge>}
								{currentPlan !== "free" && isActive && (
									<Badge variant="secondary">Active</Badge>
								)}
							</CardTitle>
							<CardDescription>{planConfig.description}</CardDescription>
						</div>
						{currentPlan !== "free" && (
							<Button variant="outline" onClick={handleManageBilling}>
								<ExternalLinkIcon className="h-4 w-4 mr-2" />
								Manage Billing
							</Button>
						)}
					</div>
				</CardHeader>

				<CardContent>
					<div className="space-y-4">
						{planExpiresAt && (
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600">
									Plan expires: {planExpiresAt.toLocaleDateString()}
								</p>
							</div>
						)}

						<div>
							<h4 className="font-medium mb-2">Plan Features:</h4>
							<ul className="space-y-2">
								{planConfig.features.map((feature) => (
									<li key={feature} className="flex items-center text-sm">
										<CheckIcon className="h-4 w-4 text-green-500 mr-2" />
										{feature}
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="font-medium mb-2">Plan Limits:</h4>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="text-gray-600">Opportunities:</span>
									<span className="ml-2 font-medium">
										{planConfig.limits.opportunities === Infinity
											? "Unlimited"
											: planConfig.limits.opportunities}
									</span>
								</div>
								<div>
									<span className="text-gray-600">Applications/month:</span>
									<span className="ml-2 font-medium">
										{planConfig.limits.applicationsPerMonth === Infinity
											? "Unlimited"
											: planConfig.limits.applicationsPerMonth}
									</span>
								</div>
							</div>
						</div>

						{showUpgradeOptions && (
							<div className="mt-6">
								<Button onClick={handleUpgrade} className="w-full" size="lg">
									<Sparkles className="h-4 w-4 mr-2" />
									Upgrade Plan
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
