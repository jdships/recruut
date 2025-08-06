"use client";

import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { ExternalLinkIcon } from "lucide-react";
import type * as React from "react";

export default function BillingAddressPage(): React.JSX.Element {
	const handleManageBilling = () => {
		// Call our simple portal API
		fetch("../../api/billing/portal", { method: "POST" })
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Billing Address</CardTitle>
				<CardDescription>
					Manage your billing address through the Polar customer portal
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button onClick={handleManageBilling} className="w-full">
					<ExternalLinkIcon className="h-4 w-4 mr-2" />
					Manage in Polar Portal
				</Button>
			</CardContent>
		</Card>
	);
}
