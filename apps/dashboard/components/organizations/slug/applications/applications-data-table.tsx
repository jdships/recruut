"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { ContactRecord } from "@workspace/database/schema";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
	DataTable,
	DataTableColumnHeader,
	DataTableColumnOptionsHeader,
	DataTablePagination,
} from "@workspace/ui/components/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { toast } from "@workspace/ui/components/sonner";
import { CenteredSpinner } from "@workspace/ui/components/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
	Calendar,
	Download,
	ExternalLink,
	Eye,
	Mail,
	MoreHorizontalIcon,
	UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { convertApplicationToContact } from "~/actions/applications/convert-application-to-contact";
import { sendInterviewRequestEmailAction } from "~/actions/applications/send-interview-request-email";
import { sendRejectionEmailAction } from "~/actions/applications/send-rejection-email";
import { ApplicationsBulkActions } from "~/components/organizations/slug/applications/applications-bulk-actions";
import { ContactAvatar } from "~/components/organizations/slug/contacts/details/contact-avatar";
import type { ApplicationRow } from "~/data/applications/get-applications";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import { useTransitionContext } from "~/hooks/use-transition-context";
import { applicationsSearchParams } from "./applications-search-params";

export type ApplicationsDataTableProps = {
	applications: ApplicationRow[];
	totalCount: number;
};

// Place columns and badge helpers above the component

// Helper functions for badge rendering
function getEducationBadge(education?: string) {
	if (!education) return <span className="text-muted-foreground">—</span>;
	return (
		<Badge variant="secondary" className="text-xs">
			{education}
		</Badge>
	);
}

function getAiFlagBadge(flag?: string, score?: number) {
	if (!flag)
		return (
			<Badge variant="outline" className="text-xs">
				—
			</Badge>
		);
	switch (flag) {
		case "great":
			return (
				<Badge variant="success" className="text-xs">
					Great
				</Badge>
			);
		case "highLevel":
			return (
				<Badge variant="highLevel" className="text-xs">
					High Level
				</Badge>
			);
		case "normal":
			// If score is below 50, show as "Below Average" with warning variant
			if (typeof score === "number" && score < 50) {
				return (
					<Badge variant="warning" className="text-xs">
						Below Average
					</Badge>
				);
			}
			return (
				<Badge variant="secondary" className="text-xs">
					Average
				</Badge>
			);
		case "belowAverage":
			return (
				<Badge variant="warning" className="text-xs">
					Below Average
				</Badge>
			);
		case "spam":
			return (
				<Badge variant="destructive" className="text-xs">
					Spam
				</Badge>
			);
		case "scam":
			return (
				<Badge variant="destructive" className="text-xs">
					Scam
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="text-xs">
					{flag}
				</Badge>
			);
	}
}

function getAiScoreBadge(score?: number) {
	if (typeof score !== "number")
		return <span className="text-muted-foreground">—</span>;
	let variant:
		| "default"
		| "secondary"
		| "destructive"
		| "success"
		| "warning"
		| "highLevel" = "default";
	if (score >= 90)
		variant = "success"; // Green (matches "Great")
	else if (score >= 70)
		variant = "highLevel"; // Blue (matches "High Level")
	else if (score >= 50)
		variant = "secondary"; // Gray (matches "Average")
	else variant = "warning"; // Amber (matches "Below Average")
	return (
		<Badge variant={variant} className="text-xs">
			{score}
		</Badge>
	);
}

function getOpportunityBadge(title?: string) {
	if (!title) return <span className="text-muted-foreground">—</span>;
	return (
		<Badge variant="outline" className="text-xs">
			{title}
		</Badge>
	);
}

const columns: ColumnDef<ApplicationRow>[] = [
	{
		id: "select",
		size: 64,
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="mx-auto flex items-center justify-center"
				onClick={(e) => e.stopPropagation()}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="mx-auto flex items-center justify-center"
				onClick={(e) => e.stopPropagation()}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		meta: { title: "Name" },
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<div className="flex w-fit flex-row items-center gap-2">
				<ContactAvatar
					record={
						row.original.record
							? (row.original.record as ContactRecord)
							: ContactRecord.PERSON
					}
					src={row.original.image}
					name={row.original.name}
					alt={row.original.name}
				/>
				<div className="whitespace-nowrap text-sm font-medium">
					{row.original.name}
				</div>
			</div>
		),
		enableSorting: true,
		enableHiding: true,
	},
	{
		meta: { title: "Education" },
		accessorKey: "education",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Education" />
		),
		cell: ({ row }) => getEducationBadge(row.original.education),
		enableSorting: true,
		enableHiding: true,
	},
	{
		meta: { title: "Experience" },
		accessorKey: "experience",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Experience" />
		),
		cell: ({ row }) => (
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="whitespace-nowrap text-sm max-w-[180px] truncate inline-block align-middle">
						{row.original.experience || (
							<span className="text-muted-foreground">—</span>
						)}
					</span>
				</TooltipTrigger>
				{row.original.experience && (
					<TooltipContent className="max-w-sm whitespace-normal break-words">
						{row.original.experience}
					</TooltipContent>
				)}
			</Tooltip>
		),
		enableSorting: true,
		enableHiding: true,
	},
	{
		meta: { title: "Portfolio" },
		accessorKey: "portfolioUrl",
		header: ({ column }) => (
			<div className="text-center w-full">
				<DataTableColumnHeader column={column} title="Portfolio" />
			</div>
		),
		cell: ({ row }) =>
			row.original.portfolioUrl ? (
				<a
					href={row.original.portfolioUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-primary underline hover:no-underline text-sm px-0 py-1"
				>
					<ExternalLink className="size-4" /> Link
				</a>
			) : (
				<span className="text-muted-foreground">—</span>
			),
		enableSorting: false,
		enableHiding: true,
	},
	{
		meta: { title: "Resume" },
		accessorKey: "resumeUrl",
		header: ({ column }) => (
			<div className="text-center w-full">
				<DataTableColumnHeader column={column} title="Resume" />
			</div>
		),
		cell: ({ row }) =>
			row.original.resumeUrl ? (
				<a
					href={row.original.resumeUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 text-xs text-primary hover:bg-muted transition-colors"
				>
					<Download className="size-3" /> Download
				</a>
			) : (
				<span className="text-muted-foreground">—</span>
			),
		enableSorting: false,
		enableHiding: true,
	},
	{
		meta: { title: "AI Score" },
		accessorKey: "aiScore",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="AI Score" />
		),
		cell: ({ row }) => getAiScoreBadge(row.original.aiScore),
		enableSorting: true,
		enableHiding: true,
	},
	{
		meta: { title: "AI Flag" },
		accessorKey: "aiFlag",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="AI Flag" />
		),
		cell: ({ row }) =>
			getAiFlagBadge(row.original.aiFlag, row.original.aiScore),
		enableSorting: true,
		enableHiding: true,
	},
	{
		meta: { title: "Opportunity" },
		accessorKey: "opportunityTitle",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Opportunity" />
		),
		cell: ({ row }) => getOpportunityBadge(row.original.opportunityTitle),
		enableSorting: true,
		enableHiding: true,
	},
	{
		id: "actions",
		size: 64,
		header: ({ table }) => <DataTableColumnOptionsHeader table={table} />,
		cell: ({ row }) => <ActionsCell row={row} />,
	},
];

export function ApplicationsDataTable({
	applications,
	totalCount,
}: ApplicationsDataTableProps): React.JSX.Element {
	const router = useRouter();
	const activeOrganization = useActiveOrganization();
	const { isLoading, startTransition } = useTransitionContext();
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

	const [pagination, setPagination] = useQueryStates(
		{
			pageIndex: applicationsSearchParams.pageIndex,
			pageSize: applicationsSearchParams.pageSize,
		},
		{
			history: "push",
			startTransition,
			shallow: false,
		},
	);

	const table = useReactTable({
		data: applications,
		columns,
		state: {
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		pageCount: Math.max(
			1,
			Math.ceil(totalCount / Math.max(1, pagination.pageSize)),
		),
		defaultColumn: {
			minSize: 0,
			size: 0,
		},
		getRowId: (row, _relativeIndex, parent) => (parent ? parent.id : row.id),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onRowSelectionChange: setRowSelection,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		enableRowSelection: true,
		manualPagination: true,
		manualFiltering: true,
	});

	const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

	const handleRowClicked = (row: Row<ApplicationRow>): void => {
		router.push(
			`/organizations/${activeOrganization?.slug}/applications/${row.original.id}`,
		);
	};

	return (
		<div className="relative flex flex-col overflow-hidden">
			<ScrollArea verticalScrollBar horizontalScrollBar className="h-full">
				<DataTable
					fixedHeader
					table={table}
					wrapperClassName="h-[calc(100svh-161px)] overflow-visible"
					onRowClicked={handleRowClicked}
				/>
			</ScrollArea>
			<DataTablePagination table={table} />
			{isLoading && <CenteredSpinner />}
			{hasSelectedRows && <ApplicationsBulkActions table={table} />}
			{/* Bulk actions can be added here if needed */}
		</div>
	);
}

function ActionsCell({ row }: { row: Row<ApplicationRow> }): React.JSX.Element {
	const [isConverting, setIsConverting] = React.useState(false);
	const [isProcessingEmail, setIsProcessingEmail] = React.useState(false);
	const router = useRouter();
	const activeOrganization = useActiveOrganization();

	const handleConvertToContact = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isConverting) return;

		setIsConverting(true);

		try {
			const result = await convertApplicationToContact({
				applicationId: row.original.id,
			});

			if (result?.data?.success) {
				toast.success(`Contact created successfully for ${row.original.name}`);
			} else if (result?.data?.error) {
				toast.error(result.data.error);
			} else {
				toast.error("Failed to convert application to contact");
			}
		} catch (error) {
			console.error("Convert to contact error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsConverting(false);
		}
	};

	const handleFriendlyRejection = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isProcessingEmail) return;

		setIsProcessingEmail(true);

		try {
			const result = await sendRejectionEmailAction({
				applicationIds: [row.original.id],
			});

			if (result?.serverError) {
				toast.error("Failed to send rejection email");
			} else {
				toast.success(`Friendly rejection email sent to ${row.original.name}.`);
			}
		} catch (error) {
			console.error("Error sending rejection email:", error);
			toast.error("Failed to send rejection email");
		} finally {
			setIsProcessingEmail(false);
		}
	};

	const handleRequestInterview = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isProcessingEmail) return;

		setIsProcessingEmail(true);

		try {
			const result = await sendInterviewRequestEmailAction({
				applicationIds: [row.original.id],
			});

			if (result?.serverError) {
				toast.error("Failed to send interview request email");
			} else {
				toast.success(`Interview request sent to ${row.original.name}.`);
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
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<MoreHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						router.push(
							`/organizations/${activeOrganization?.slug}/applications/${row.original.id}`,
						);
					}}
				>
					<Eye className="h-4 w-4" />
					View
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleConvertToContact}
					disabled={isConverting}
				>
					{isConverting ? (
						<CenteredSpinner className="h-4 w-4" />
					) : (
						<UserPlus className="h-4 w-4" />
					)}
					Create Contact
				</DropdownMenuItem>
				<DropdownMenuSeparator />
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
				{row.original.resumeUrl && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<a
								href={row.original.resumeUrl}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
							>
								<Download className="h-4 w-4" />
								Download CV
							</a>
						</DropdownMenuItem>
					</>
				)}
				{row.original.portfolioUrl && (
					<DropdownMenuItem asChild>
						<a
							href={row.original.portfolioUrl}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
						>
							<ExternalLink className="h-4 w-4" />
							View Portfolio
						</a>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
