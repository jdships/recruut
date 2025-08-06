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
import { useActiveOrganization } from "~/hooks/use-active-organization";
import type { OpportunityRow } from "./opportunities-data-table";

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

export type OpportunitiesBulkActionsProps = {
	table: Table<OpportunityRow>;
};
export function OpportunitiesBulkActions({
	table,
}: OpportunitiesBulkActionsProps): React.JSX.Element {
	const activeOrganization = useActiveOrganization();
	const handleExportSelectedOpportunitiesToCsv = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		const response = await fetch(
			`${routes.dashboard.Api}/export/csv/opportunity-list`,
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
			toast.error("Couldn't export selected opportunities to CSV");
		} else {
			const data = await response.blob();
			const disposition = response.headers.get("Content-Disposition") ?? "";
			const filename = extractFilenameFromContentDispositionHeader(disposition);

			saveAs(data, filename);
		}
	};

	const handleExportSelectedOpportunitiesToExcel = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		const response = await fetch(
			`${routes.dashboard.Api}/export/excel/opportunity-list`,
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
			toast.error("Couldn't export selected opportunities to Excel");
		} else {
			const data = await response.blob();
			const disposition = response.headers.get("Content-Disposition") ?? "";
			const filename = extractFilenameFromContentDispositionHeader(disposition);

			saveAs(data, filename);
		}
	};

	const handleShowDeleteOpportunitiesModal = () => {
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length === 0) {
			return;
		}

		// Uncomment and implement this modal if needed
		// NiceModal.show(DeleteOpportunitiesModal, {
		//   opportunities: selectedRows.map((row) => row.original)
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
						onClick={handleExportSelectedOpportunitiesToCsv}
					>
						Export to CSV
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={handleExportSelectedOpportunitiesToExcel}
					>
						Export to Excel
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive! cursor-pointer"
						onClick={handleShowDeleteOpportunitiesModal}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</DataTableBulkActions>
	);
}
