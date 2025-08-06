"use client";
import { Button } from "@workspace/ui/components/button";
import { DataTableFilter } from "@workspace/ui/components/data-table";
import { InputSearch } from "@workspace/ui/components/input-search";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";
import { MediaQueries } from "@workspace/ui/lib/media-queries";
import { SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { useTransitionContext } from "~/hooks/use-transition-context";
import { applicationsSearchParams } from "./applications-search-params";

export type ApplicationsFiltersProps = {
	opportunities: { value: string; label: string }[];
	flags: { value: string; label: string }[];
};

export function ApplicationsFilters({
	opportunities,
	flags,
}: ApplicationsFiltersProps): React.JSX.Element {
	const { startTransition } = useTransitionContext();
	const [showMobileSearch, setShowMobileSearch] = React.useState(false);
	const smUp = useMediaQuery(MediaQueries.SmUp, { fallback: false });

	const [searchQuery, setSearchQuery] = useQueryState(
		"searchQuery",
		applicationsSearchParams.searchQuery.withOptions({
			startTransition,
			shallow: false,
		}),
	);
	const [selectedOpportunity, setSelectedOpportunity] = useQueryState(
		"opportunity",
		applicationsSearchParams.opportunity.withOptions({
			startTransition,
			shallow: false,
		}),
	);
	const [selectedFlags, setSelectedFlags] = useQueryState(
		"flags",
		applicationsSearchParams.flags.withOptions({
			startTransition,
			shallow: false,
		}),
	);
	const [pageIndex, setPageIndex] = useQueryState(
		"pageIndex",
		applicationsSearchParams.pageIndex.withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target?.value || "";
		if (value !== searchQuery) {
			setSearchQuery(value);
			if (pageIndex !== 0) setPageIndex(0);
		}
	};

	const handleOpportunityChange = (value: string) => {
		if (value === "all") {
			setSelectedOpportunity(""); // Clear the filter
			if (pageIndex !== 0) setPageIndex(0);
			return;
		}
		if (value !== selectedOpportunity) {
			setSelectedOpportunity(value);
			if (pageIndex !== 0) setPageIndex(0);
		}
	};

	const handleFlagsChange = (values: string[]) => {
		setSelectedFlags(values);
		if (pageIndex !== 0) setPageIndex(0);
	};

	const handleShowMobileSearch = (): void => {
		setShowMobileSearch(true);
	};
	const handleHideMobileSearch = (): void => {
		setShowMobileSearch(false);
	};

	return (
		<>
			<div className="flex items-center gap-2">
				<Select
					value={selectedOpportunity || "all"}
					onValueChange={handleOpportunityChange}
				>
					<SelectTrigger
						className=" max-w-xs px-4 flex items-center text-xs"
						size="sm"
					>
						<span className="flex-1 min-w-0 max-w-[140px] truncate">
							<SelectValue placeholder="All Opportunities" />
						</span>
					</SelectTrigger>
					<SelectContent>
						<SelectItem className="text-xs" value="all">
							All Opportunities
						</SelectItem>
						{opportunities.map((op) => (
							<SelectItem className="text-xs" key={op.value} value={op.value}>
								{op.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<DataTableFilter
					title="Flags"
					options={flags}
					selected={selectedFlags || []}
					onChange={handleFlagsChange}
				/>
			</div>
			<div>
				{smUp ? (
					<InputSearch
						placeholder="Search by name or email..."
						className="peer ps-9 pe-9 !text-xs w-[240px]"
						value={searchQuery}
						onChange={handleSearchQueryChange}
					/>
				) : (
					<>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={handleShowMobileSearch}
						>
							<SearchIcon className="size-4 shrink-0" />
						</Button>
						{showMobileSearch && (
							<div className="absolute inset-0 z-30 bg-background">
								<InputSearch
									autoFocus
									alwaysShowClearButton
									placeholder="Search by name or email..."
									className="h-12 w-full border-none ring-0!"
									containerClassName="h-12"
									value={searchQuery}
									onChange={handleSearchQueryChange}
									onClear={handleHideMobileSearch}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
}
