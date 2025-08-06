"use client";

import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "@workspace/ui/components/sonner";
import { CenteredSpinner } from "@workspace/ui/components/spinner";
import { Calendar, Mail, MoreVerticalIcon } from "lucide-react";
import * as React from "react";

import { sendInterviewRequestEmailAction } from "~/actions/applications/send-interview-request-email";
import { sendRejectionEmailAction } from "~/actions/applications/send-rejection-email";
import type { ApplicationDto } from "~/types/dtos/application-dto";

export type ApplicationActionsProps = {
	application: ApplicationDto;
};

export function ApplicationActions({
	application,
}: ApplicationActionsProps): React.JSX.Element {
	const [isProcessingEmail, setIsProcessingEmail] = React.useState(false);

	const handleFriendlyRejection = async () => {
		if (isProcessingEmail) return;

		setIsProcessingEmail(true);

		try {
			const result = await sendRejectionEmailAction({
				applicationIds: [application.id],
			});

			if (result?.serverError) {
				toast.error("Failed to send rejection email");
			} else {
				toast.success(`Friendly rejection email sent to ${application.name}.`);
			}
		} catch (error) {
			console.error("Error sending rejection email:", error);
			toast.error("Failed to send rejection email");
		} finally {
			setIsProcessingEmail(false);
		}
	};

	const handleRequestInterview = async () => {
		if (isProcessingEmail) return;

		setIsProcessingEmail(true);

		try {
			const result = await sendInterviewRequestEmailAction({
				applicationIds: [application.id],
			});

			if (result?.serverError) {
				toast.error("Failed to send interview request email");
			} else {
				toast.success(`Interview request sent to ${application.name}.`);
			}
		} catch (error) {
			console.error("Error sending interview request email:", error);
			toast.error("Failed to send interview request email");
		} finally {
			setIsProcessingEmail(false);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<MoreVerticalIcon className="size-4 shrink-0" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					onClick={handleFriendlyRejection}
					disabled={isProcessingEmail}
				>
					{isProcessingEmail ? (
						<CenteredSpinner className="h-4 w-4" />
					) : (
						<Mail className="h-4 w-4" />
					)}
					{isProcessingEmail ? "Sending..." : "Friendly Rejection"}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleRequestInterview}
					disabled={isProcessingEmail}
				>
					{isProcessingEmail ? (
						<CenteredSpinner className="h-4 w-4" />
					) : (
						<Calendar className="h-4 w-4" />
					)}
					{isProcessingEmail ? "Sending..." : "Request Interview"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
