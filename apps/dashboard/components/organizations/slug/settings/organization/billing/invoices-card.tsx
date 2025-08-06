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

export type InvoicesCardProps = {
	className?: string;
};

export function InvoicesCard({
	className,
}: InvoicesCardProps): React.JSX.Element {
	const handleViewInvoices = () => {
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

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Invoices</CardTitle>
				<CardDescription>
					View and download your invoices through the Polar customer portal
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button onClick={handleViewInvoices} className="w-full">
					<ExternalLinkIcon className="h-4 w-4 mr-2" />
					View Invoices in Polar Portal
				</Button>
			</CardContent>
		</Card>
	);
}
