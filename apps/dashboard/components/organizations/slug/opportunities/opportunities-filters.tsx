"use client";
import { Button } from "@workspace/ui/components/button";
import { InputSearch } from "@workspace/ui/components/input-search";
import {
	UnderlinedTabs,
	UnderlinedTabsList,
	UnderlinedTabsTrigger,
} from "@workspace/ui/components/tabs";
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";
import { MediaQueries } from "@workspace/ui/lib/media-queries";
import { Rows3, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { useTransitionContext } from "~/hooks/use-transition-context";
import { opportunitiesSearchParams } from "./opportunities-search-params";

export function OpportunitiesFilters(): React.JSX.Element {
	const { startTransition } = useTransitionContext();
	const [showMobileSearch, setShowMobileSearch] = React.useState(false);
	const smUp = useMediaQuery(MediaQueries.SmUp, { fallback: false });

	const [searchQuery, setSearchQuery] = useQueryState(
		"searchQuery",
		opportunitiesSearchParams.searchQuery.withOptions({
			startTransition,
			shallow: false,
		}),
	);
	const [pageIndex, setPageIndex] = useQueryState(
		"pageIndex",
		opportunitiesSearchParams.pageIndex.withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		if (pageIndex !== 0) {
			setPageIndex(0);
		}
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
				<UnderlinedTabs
					value={"all"}
					onValueChange={() => {}}
					className="hidden sm:flex -ml-2"
				>
					<UnderlinedTabsList className="mr-2 h-12 max-h-12 min-h-12 gap-x-2 border-none">
						<UnderlinedTabsTrigger
							key="all"
							value="all"
							className="mx-0 border-t-4 border-t-transparent"
						>
							<div className="flex flex-row items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
								<Rows3 className="size-4 shrink-0" />
								All
							</div>
						</UnderlinedTabsTrigger>
						{/* Future: Add more tabs for status, etc. */}
					</UnderlinedTabsList>
				</UnderlinedTabs>
			</div>
			<div>
				{smUp ? (
					<InputSearch
						placeholder="Search by title or description..."
						className=" !text-xs w-[240px]"
						value={typeof searchQuery === "string" ? searchQuery : ""}
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
									placeholder="Search by title or description..."
									className="h-12 w-full border-none ring-0!"
									containerClassName="h-12"
									value={typeof searchQuery === "string" ? searchQuery : ""}
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
