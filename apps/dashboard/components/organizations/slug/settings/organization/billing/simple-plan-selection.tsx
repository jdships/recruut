"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/components/sonner";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { createCheckoutSessionUrl } from "~/actions/billing/create-checkout-session-url";
import { PLAN_CONFIGS, type PlanType } from "~/lib/plans";

type Props = {
	currentPlan: PlanType;
	className?: string;
};

export function SimplePlanSelection({ currentPlan, className }: Props) {
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
	const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

	const handleUpgrade = async (plan: "pro" | "unlimited") => {
		try {
			setLoadingPlan(plan);

			const result = await createCheckoutSessionUrl({ plan, interval });

			if (result?.data?.url) {
				// Redirect to Polar checkout
				window.location.href = result.data.url;
			} else {
				toast.error("Failed to create checkout session");
			}
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("Failed to start checkout process");
		} finally {
			setLoadingPlan(null);
		}
	};

	return (
		<div className={className}>
			<div className="mb-6">
				<div className="flex items-center justify-center mb-4">
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setInterval("monthly")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								interval === "monthly"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Monthly
						</button>
						<button
							onClick={() => setInterval("yearly")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								interval === "yearly"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Yearly <span className="text-green-600 ml-1">(-17%)</span>
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{Object.values(PLAN_CONFIGS).map((plan) => {
					const price =
						interval === "monthly" ? plan.price.monthly : plan.price.yearly;
					const isCurrent = currentPlan === plan.id;
					const canUpgrade = plan.id !== "free" && currentPlan === "free";

					return (
						<Card
							key={plan.id}
							className={`relative ${isCurrent ? "ring-2 ring-blue-500" : ""}`}
						>
							{isCurrent && (
								<Badge className="absolute -top-2 left-4 bg-blue-500">
									Current Plan
								</Badge>
							)}

							<CardHeader>
								<CardTitle className="text-xl">{plan.name}</CardTitle>
								<CardDescription>{plan.description}</CardDescription>
								<div className="mt-4">
									<span className="text-3xl font-bold">${price}</span>
									<span className="text-gray-600">
										/{interval === "monthly" ? "month" : "year"}
									</span>
								</div>
							</CardHeader>

							<CardContent>
								<ul className="space-y-3 mb-6">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-center">
											<CheckIcon className="h-4 w-4 text-green-500 mr-2" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>

								{plan.id === "free" ? (
									<Button variant="outline" disabled className="w-full">
										{isCurrent ? "Current Plan" : "Free Forever"}
									</Button>
								) : isCurrent ? (
									<Button variant="outline" disabled className="w-full">
										Current Plan
									</Button>
								) : canUpgrade ? (
									<Button
										onClick={() =>
											handleUpgrade(plan.id as "pro" | "unlimited")
										}
										disabled={loadingPlan === plan.id}
										className="w-full"
									>
										{loadingPlan === plan.id
											? "Loading..."
											: `Upgrade to ${plan.name}`}
									</Button>
								) : (
									<Button variant="outline" disabled className="w-full">
										Contact Sales
									</Button>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
