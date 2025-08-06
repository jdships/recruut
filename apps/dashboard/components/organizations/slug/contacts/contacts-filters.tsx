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

import { searchParams } from "~/components/organizations/slug/contacts/contacts-search-params";
import { useTransitionContext } from "~/hooks/use-transition-context";
import { RecordsOption } from "~/schemas/contacts/get-contacts-schema";
import type { TagDto } from "~/types/dtos/tag-dto";

export type ContactsFiltersProps = {
	tags: TagDto[];
};

export function ContactsFilters({
	tags,
}: ContactsFiltersProps): React.JSX.Element {
	const { startTransition } = useTransitionContext();
	const [showMobileSerch, setShowMobileSearch] = React.useState<boolean>(false);
	const smUp = useMediaQuery(MediaQueries.SmUp, { fallback: false });

	const [searchQuery, setSearchQuery] = useQueryState(
		"searchQuery",
		searchParams.searchQuery.withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const [records, setRecords] = useQueryState(
		"records",
		searchParams.records.withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const [selectedTags, setSelectedTags] = useQueryState(
		"tags",
		searchParams.tags.withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const [pageIndex, setPageIndex] = useQueryState(
		"pageIndex",
		searchParams.pageIndex.withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const handleSearchQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = e.target?.value || "";
		if (value !== searchQuery) {
			setSearchQuery(value);
			if (pageIndex !== 0) {
				setPageIndex(0);
			}
		}
	};

	const handleRecordsChange = (value: string): void => {
		if (value !== records) {
			setRecords(value as RecordsOption);
			if (pageIndex !== 0) {
				setPageIndex(0);
			}
		}
	};

	const handleTagsChange = (tags: string[]): void => {
		setSelectedTags(tags);
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
					value={records}
					onValueChange={handleRecordsChange}
					className="hidden sm:flex -ml-2"
				>
					<UnderlinedTabsList className="mr-2 h-12 max-h-12 min-h-12 gap-x-2 border-none">
						{recordsOptions.map((option) => (
							<UnderlinedTabsTrigger
								key={option.value}
								value={option.value}
								className="mx-0 border-t-4 border-t-transparent"
							>
								<div className="flex flex-row items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
									{option.icon}
									{option.label}
								</div>
							</UnderlinedTabsTrigger>
						))}
					</UnderlinedTabsList>
				</UnderlinedTabs>
				<Select
					value={records}
					onValueChange={(value) => setRecords(value as RecordsOption)}
				>
					<SelectTrigger className="flex sm:hidden">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{recordsOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								<div className="flex flex-row items-center gap-2 pr-2">
									{option.icon}
									{option.label}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<DataTableFilter
					title="Tags"
					options={tags.map((tag) => ({ value: tag.text, label: tag.text }))}
					selected={selectedTags || []}
					onChange={handleTagsChange}
				/>
			</div>
			<div>
				{smUp ? (
					<InputSearch
						placeholder="Search by name or email..."
						className=" !text-xs w-[240px]"
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
						{showMobileSerch && (
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

const recordsOptions = [
	{
		label: "All",
		value: RecordsOption.All,
		icon: <Rows3 className="size-4 shrink-0" />,
	},
];
