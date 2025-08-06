/**
 * Simple billing success page
 * Shows confirmation after successful Polar checkout
 */

import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

type Props = {
	searchParams: {
		session_id?: string;
		plan?: string;
		interval?: string;
	};
};

export default function BillingSuccessPage({ searchParams }: Props) {
	const { session_id, plan, interval } = searchParams;

	return (
		<div className="container mx-auto max-w-2xl py-12">
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircleIcon className="h-8 w-8 text-green-600" />
					</div>
					<CardTitle className="text-2xl">Payment Successful!</CardTitle>
					<CardDescription>
						Your subscription has been activated successfully.
					</CardDescription>
				</CardHeader>

				<CardContent className="text-center space-y-6">
					{plan && (
						<div className="rounded-lg bg-gray-50 p-4">
							<h3 className="font-medium text-gray-900">
								{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
							</h3>
							{interval && (
								<p className="text-sm text-gray-600">Billed {interval}</p>
							)}
						</div>
					)}

					{session_id && (
						<div className="text-sm text-gray-500">
							Session ID: {session_id}
						</div>
					)}

					<div className="space-y-3">
						<p className="text-gray-600">
							You now have access to all the features included in your plan.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button asChild>
								<Link href="/dashboard">Go to Dashboard</Link>
							</Button>

							<Button variant="outline" asChild>
								<Link href="/settings/billing">Manage Billing</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
