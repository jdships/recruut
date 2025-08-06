"use client";

import NiceModal from "@ebay/nice-modal-react";
import { IconArrowUpRight, IconSparkles } from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { UpgradePlanDialog } from "~/components/organizations/slug/settings/organization/billing/upgrade-plan-dialog";

export type UpgradePromptProps = {
	title: string;
	description: string;
	currentUsage?: number;
	limit?: number;
	feature: string;
};

export function UpgradePrompt({
	title,
	description,
	currentUsage,
	limit,
	feature,
}: UpgradePromptProps) {
	const handleUpgrade = () => {
		NiceModal.show(UpgradePlanDialog);
	};
	return (
		<Card className="p-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
			<div className="flex items-start justify-between">
				<div className="space-y-4 flex-1">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<IconSparkles className="size-5 text-amber-600 dark:text-amber-400" />
							<h3 className="font-semibold text-foreground">{title}</h3>
							<Badge variant="outline" className="text-xs">
								{feature}
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground">{description}</p>
						{currentUsage !== undefined && limit !== undefined && (
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>
									Usage: {currentUsage} / {limit}
								</span>
								<div className="w-24 bg-border rounded-full h-1.5">
									<div
										className="bg-amber-500 h-1.5 rounded-full"
										style={{
											width: `${Math.min((currentUsage / limit) * 100, 100)}%`,
										}}
									/>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-2">
						<Button size="sm" className="gap-1" onClick={handleUpgrade}>
							<IconSparkles className="size-3" />
							Upgrade Plan
							<IconArrowUpRight className="size-3" />
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
}

export type LimitReachedPromptProps = {
	feature: string;
	currentPlan: string;
};

export function LimitReachedPrompt({
	feature,
	currentPlan,
}: LimitReachedPromptProps) {
	const handleUpgrade = () => {
		NiceModal.show(UpgradePlanDialog);
	};
	return (
		<div className="text-center space-y-4 py-8">
			<div className="space-y-2">
				<IconSparkles className="size-12 text-amber-500 mx-auto" />
				<h3 className="text-lg font-semibold">{feature} Limit Reached</h3>
				<p className="text-muted-foreground max-w-md mx-auto">
					You've reached the limit for your {currentPlan} plan. Upgrade to
					unlock unlimited {feature.toLowerCase()}.
				</p>
			</div>

			<Button className="gap-2" onClick={handleUpgrade}>
				<IconSparkles className="size-4" />
				Upgrade Plan
				<IconArrowUpRight className="size-4" />
			</Button>
		</div>
	);
}
