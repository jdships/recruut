"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
	DataTable,
	DataTableColumnHeader,
	DataTablePagination,
} from "@workspace/ui/components/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { CopyIcon } from "@workspace/ui/components/icons/copy";
import { DeleteIcon } from "@workspace/ui/components/icons/delete";
import { PauseIcon } from "@workspace/ui/components/icons/pause";
import { PlayIcon } from "@workspace/ui/components/icons/play";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { toast } from "@workspace/ui/components/sonner";
import { CenteredSpinner } from "@workspace/ui/components/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontalIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { deleteOpportunity } from "~/actions/opportunities/delete-opportunity";
import { pauseOpportunity } from "~/actions/opportunities/pause-opportunity";
import { reactivateOpportunity } from "~/actions/opportunities/reactivate-opportunity";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import { useHover } from "~/hooks/use-hover";
import { useTransitionContext } from "~/hooks/use-transition-context";
import { OpportunitiesBulkActions } from "./opportunities-bulk-actions";
import { opportunitiesSearchParams } from "./opportunities-search-params";

// Separate component for the actions menu
function OpportunityActions({
	opportunityId,
	status,
}: {
	opportunityId: string;
	status?: string;
}) {
	const { startTransition } = useTransitionContext();
	const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
	const {
		isHovered: isCopyHovered,
		handleMouseEnter: handleCopyMouseEnter,
		handleMouseLeave: handleCopyMouseLeave,
	} = useHover();
	const {
		isHovered: isDeleteHovered,
		handleMouseEnter: handleDeleteMouseEnter,
		handleMouseLeave: handleDeleteMouseLeave,
	} = useHover();
	const {
		isHovered: isPlayHovered,
		handleMouseEnter: handlePlayMouseEnter,
		handleMouseLeave: handlePlayMouseLeave,
	} = useHover();
	const {
		isHovered: isPauseHovered,
		handleMouseEnter: handlePauseMouseEnter,
		handleMouseLeave: handlePauseMouseLeave,
	} = useHover();

	const handlePause = () => {
		startTransition(async () => {
			try {
				await pauseOpportunity({ id: opportunityId });
				toast.success("Opportunity paused successfully");
			} catch (_error) {
				toast.error("Failed to pause opportunity");
			}
		});
	};

	const handleDelete = () => {
		setShowDeleteConfirm(true);
	};

	const confirmDelete = () => {
		startTransition(async () => {
			try {
				await deleteOpportunity({ id: opportunityId });
				toast.success("Opportunity deleted successfully");
				setShowDeleteConfirm(false);
			} catch (_error) {
				toast.error("Failed to delete opportunity");
			}
		});
	};

	const handleReactivate = () => {
		startTransition(async () => {
			try {
				await reactivateOpportunity({ id: opportunityId });
				toast.success("Opportunity reactivated successfully");
			} catch (_error) {
				toast.error("Failed to reactivate opportunity");
			}
		});
	};

	const applicationUrl = `${process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:3002"}/${opportunityId}`;

	const handleCopyUrl = async () => {
		await navigator.clipboard.writeText(applicationUrl);
		toast.success("Application URL copied to clipboard!");
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<MoreHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={handleCopyUrl}
						onMouseEnter={handleCopyMouseEnter}
						onMouseLeave={handleCopyMouseLeave}
					>
						<CopyIcon className="h-4 w-4" isHovered={isCopyHovered} />
						Copy URL
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					{status !== "paused" && (
						<DropdownMenuItem
							onClick={handlePause}
							onMouseEnter={handlePauseMouseEnter}
							onMouseLeave={handlePauseMouseLeave}
						>
							<PauseIcon className="h-4 w-4" isHovered={isPauseHovered} />
							Pause
						</DropdownMenuItem>
					)}
					{status === "paused" && (
						<DropdownMenuItem
							onClick={handleReactivate}
							onMouseEnter={handlePlayMouseEnter}
							onMouseLeave={handlePlayMouseLeave}
						>
							<PlayIcon className="h-4 w-4" isHovered={isPlayHovered} />
							Reactivate
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						onClick={handleDelete}
						onMouseEnter={handleDeleteMouseEnter}
						onMouseLeave={handleDeleteMouseLeave}
						className="text-destructive focus:text-destructive"
					>
						<DeleteIcon
							className="h-4 w-4 text-destructive [&>svg]:stroke-destructive"
							isHovered={isDeleteHovered}
						/>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Delete Opportunity</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this opportunity? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowDeleteConfirm(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

export type OpportunityRow = {
	id: string;
	title: string;
	description?: string;
	createdAt: string;
	status?: string;
	avatars: string[];
	avatarNames: string[];
	submissionCount: number;
};

export type OpportunitiesDataTableProps = {
	data: OpportunityRow[];
	totalCount: number;
};

export function OpportunitiesDataTable({
	data,
	totalCount: _totalCount,
}: OpportunitiesDataTableProps): React.JSX.Element {
	const _router = useRouter();
	const _activeOrganization = useActiveOrganization();
	const { isLoading, startTransition } = useTransitionContext();
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

	// Define columns here to access router and activeOrganization
	const columns: ColumnDef<OpportunityRow>[] = [
		{
			id: "select",
			size: 40, // Reduced from 64 to 40
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
			accessorKey: "title",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Title" />
			),
			cell: ({ row }) => (
				<span className="font-medium text-foreground">
					{row.original.title}
				</span>
			),
			enableSorting: true,
			enableHiding: true,
			size: 200, // Give more width to title
			minSize: 150,
		},
		{
			accessorKey: "description",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Description" />
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground max-w-[240px] truncate block">
					{row.original.description || (
						<span className="text-muted-foreground">—</span>
					)}
				</span>
			),
			enableSorting: false,
			enableHiding: true,
			size: 300, // Give more width to description
			minSize: 200,
		},
		{
			accessorKey: "submissionCount",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Applicants" />
			),
			cell: ({ row }) => {
				const avatars = row.original.avatars || [];
				const names = row.original.avatarNames || [];
				const hasApplicants = avatars.length > 0 || names.length > 0;
				return (
					<div className="flex items-center">
						<div className="flex -space-x-1 overflow-hidden">
							{hasApplicants
								? [0, 1, 2].map((i) => {
										const img = avatars[i];
										const name = names[i];
										const initials = name
											? name
													.split(" ")
													.map((n) => n[0])
													.join("")
													.slice(0, 2)
													.toUpperCase()
											: undefined;
										if (img || name) {
											return (
												<TooltipProvider key={img || name || i}>
													<Tooltip>
														<TooltipTrigger asChild>
															<Avatar className="h-5 w-5 ring-2 ring-background bg-muted">
																{img && (
																	<AvatarImage
																		src={img}
																		alt={name || "Applicant avatar"}
																	/>
																)}
																<AvatarFallback>
																	{initials || (
																		<UserIcon className="size-4 text-muted-foreground" />
																	)}
																</AvatarFallback>
															</Avatar>
														</TooltipTrigger>
														<TooltipContent>
															{name || "Applicant"}
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											);
										} else {
											return null;
										}
									})
								: [0, 1, 2].map((i) => (
										<span
											key={i}
											className="inline-block h-5 w-5 rounded-full ring-2 ring-background bg-muted"
										/>
									))}
						</div>
						<span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border cursor-default ml-2">
							{row.original.submissionCount}
						</span>
					</div>
				);
			},
			enableSorting: true,
			enableHiding: true,
			size: 120, // Same width as Created and Actions
			maxSize: 120,
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created" />
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{new Date(row.original.createdAt).toLocaleDateString()}
				</span>
			),
			enableSorting: true,
			enableHiding: true,
			size: 120, // Fixed width in pixels
			maxSize: 120, // Maximum width
		},
		// Status column
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => {
				const status = row.original.status || "active";
				return (
					<span
						className={cn(
							"inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
							status === "active"
								? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
								: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
						)}
					>
						{status === "active" ? "Active" : "Paused"}
					</span>
				);
			},
			enableSorting: true,
			enableHiding: true,
			size: 100,
			maxSize: 100,
		},
		// Actions column
		{
			id: "actions",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Actions"
					className="!text-center"
				/>
			),
			cell: ({ row }) => {
				const opportunityId = row.original.id;
				const status = row.original.status;
				return (
					<div className="flex justify-center">
						<OpportunityActions opportunityId={opportunityId} status={status} />
					</div>
				);
			},
			enableSorting: false,
			enableHiding: false,
			size: 80, // Reduced width since we have a separate status column
			maxSize: 80,
		},
	];

	// Use query state for sorting and pagination
	const [sorting, setSorting] = React.useState([
		{ id: "createdAt", desc: true },
	]);
	const [pagination, setPagination] = useQueryStates(
		{
			pageIndex: opportunitiesSearchParams.pageIndex,
			pageSize: opportunitiesSearchParams.pageSize,
		},
		{
			history: "push",
			startTransition,
			shallow: false,
		},
	);
	const [searchQuery] = useQueryStates(
		{ searchQuery: opportunitiesSearchParams.searchQuery },
		{ history: "push", startTransition, shallow: false },
	);

	// Filter data by search query (client-side, like ApplicationsDataTable)
	let filteredRows = data;
	if (searchQuery.searchQuery) {
		const lower = searchQuery.searchQuery.toLowerCase();
		filteredRows = filteredRows.filter(
			(row) =>
				row.title.toLowerCase().includes(lower) ||
				(row.description && row.description.toLowerCase().includes(lower)),
		);
	}
	const totalFiltered = filteredRows.length;
	const paginatedRows = filteredRows.slice(
		pagination.pageIndex * pagination.pageSize,
		(pagination.pageIndex + 1) * pagination.pageSize,
	);

	const table = useReactTable({
		data: paginatedRows,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		pageCount: Math.max(
			1,
			Math.ceil(totalFiltered / Math.max(1, pagination.pageSize)),
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
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		enableRowSelection: true,
		manualPagination: true,
		manualFiltering: true,
	});

	const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

	return (
		<div className="relative flex flex-col overflow-hidden">
			<ScrollArea verticalScrollBar horizontalScrollBar className="h-full">
				<DataTable
					fixedHeader
					table={table}
					wrapperClassName="h-[calc(100svh-161px)] overflow-visible"
				/>
			</ScrollArea>
			<DataTablePagination table={table} />
			{isLoading && <CenteredSpinner />}
			{hasSelectedRows && <OpportunitiesBulkActions table={table} />}
		</div>
	);
}
