"use client";
import type { Table } from "@tanstack/react-table";
import { HttpMethod, MediaTypeNames } from "@workspace/common/http";
import { routes } from "@workspace/routes";
import { Button } from "@workspace/ui/components/button";
import { DataTableBulkActions } from "@workspace/ui/components/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "@workspace/ui/components/sonner";
import { saveAs } from "file-saver";
import { ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";

import { sendInterviewRequestEmailAction } from "~/actions/applications/send-interview-request-email";
import { sendRejectionEmailAction } from "~/actions/applications/send-rejection-email";
import type { ApplicationRow } from "~/data/applications/get-applications";
// You may need to create this modal if it doesn't exist yet
// import { DeleteApplicationsModal } from '~/components/organizations/slug/applications/delete-applications-modal';
import { useActiveOrganization } from "~/hooks/use-active-organization";

function extractFilenameFromContentDispositionHeader(header: string): string {
	const defaultFileName = "download";
	const fileNameToken = "filename*=UTF-8''";

	for (const part of header.split(";")) {
		if (part.trim().indexOf(fileNameToken) === 0) {
			return decodeURIComponent(part.trim().replace(fileNameToken, ""));
		}
	}

	return defaultFileName;
}

export type ApplicationsBulkActionsProps = {
	table: Table<ApplicationRow>;
};
export function ApplicationsBulkActions({
	table,
}: ApplicationsBulkActionsProps): React.JSX.Element {
	const activeOrganization = useActiveOrganization();
	const [isProcessing, setIsProcessing] = React.useState(false);
	const handleExportSelectedApplicationsToCsv = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		const response = await fetch(
			`${routes.dashboard.Api}/export/csv/application-list`,
			{
				method: HttpMethod.Post,
				headers: {
					"content-type": MediaTypeNames.Application.Json,
				},
				body: JSON.stringify({
					organizationId: activeOrganization.id,
					ids: selectedRows.map((row) => row.original.id),
				}),
			},
		);
		if (!response.ok) {
			toast.error("Couldn't export selected applications to CSV");
		} else {
			const data = await response.blob();
			const disposition = response.headers.get("Content-Disposition") ?? "";
			const filename = extractFilenameFromContentDispositionHeader(disposition);

			saveAs(data, filename);
		}
	};

	const handleExportSelectedApplicationsToExcel = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		const response = await fetch(
			`${routes.dashboard.Api}/export/excel/application-list`,
			{
				method: HttpMethod.Post,
				headers: {
					"content-type": MediaTypeNames.Application.Json,
				},
				body: JSON.stringify({
					organizationId: activeOrganization.id,
					ids: selectedRows.map((row) => row.original.id),
				}),
			},
		);
		if (!response.ok) {
			toast.error("Couldn't export selected applications to Excel");
		} else {
			const data = await response.blob();
			const disposition = response.headers.get("Content-Disposition") ?? "";
			const filename = extractFilenameFromContentDispositionHeader(disposition);

			saveAs(data, filename);
		}
	};

	const handleFriendlyRejection = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		if (isProcessing) {
			return;
		}

		setIsProcessing(true);

		try {
			const applicationIds = selectedRows.map((row) => row.original.id);
			const result = await sendRejectionEmailAction({ applicationIds });

			if (result?.serverError) {
				toast.error("Failed to send rejection emails");
			} else {
				toast.success(
					`Friendly rejection email sent to ${result?.data?.count || selectedRows.length} applicant(s).`,
				);
				// Clear selection after success
				table.toggleAllRowsSelected(false);
			}
		} catch (error) {
			console.error("Error sending rejection emails:", error);
			toast.error("Failed to send rejection emails");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleRequestInterview = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		if (isProcessing) {
			return;
		}

		setIsProcessing(true);

		try {
			const applicationIds = selectedRows.map((row) => row.original.id);
			const result = await sendInterviewRequestEmailAction({ applicationIds });

			if (result?.serverError) {
				toast.error("Failed to send interview request emails");
			} else {
				toast.success(
					`Interview request sent to ${result?.data?.count || selectedRows.length} applicant(s).`,
				);
				// Clear selection after success
				table.toggleAllRowsSelected(false);
			}
		} catch (error) {
			console.error("Error sending interview request emails:", error);
			toast.error("Failed to send interview request emails");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleShowDeleteApplicationsModal = () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		// Uncomment and implement this modal if needed
		// NiceModal.show(DeleteApplicationsModal, {
		//   applications: selectedRows.map((row) => row.original)
		// });
	};

	return (
		<DataTableBulkActions table={table}>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="outline"
						size="default"
						className="text-sm"
					>
						Bulk actions
						<ChevronsUpDownIcon className="ml-1 size-4 opacity-50" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={handleExportSelectedApplicationsToCsv}
					>
						Export to CSV
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={handleExportSelectedApplicationsToExcel}
					>
						Export to Excel
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={handleFriendlyRejection}
						disabled={isProcessing}
					>
						{isProcessing ? "Sending..." : "Friendly Rejection"}
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={handleRequestInterview}
						disabled={isProcessing}
					>
						{isProcessing ? "Sending..." : "Request Interview"}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive! cursor-pointer"
						onClick={handleShowDeleteApplicationsModal}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</DataTableBulkActions>
	);
}
