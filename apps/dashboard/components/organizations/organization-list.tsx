"use client";

import NiceModal from "@ebay/nice-modal-react";
import {
	baseUrl,
	getPathname,
	replaceOrgSlug,
	routes,
} from "@workspace/routes";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { buttonVariants } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { EmptyState } from "@workspace/ui/components/empty-state";
import { InputSearch } from "@workspace/ui/components/input-search";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
	ChevronRightIcon,
	PlusIcon,
	SparklesIcon,
	StoreIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { getUserPlanLimitsAction } from "~/actions/organization/get-user-plan-limits";
import { UpgradePlanDialog } from "~/components/organizations/slug/settings/organization/billing/upgrade-plan-dialog";

import type { OrganizationDto } from "~/types/dtos/organization-dto";

export type OrganizationListProps = {
	organizations: OrganizationDto[];
};

export function OrganizationList({
	organizations,
}: OrganizationListProps): React.JSX.Element {
	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const [canCreateMultiple, setCanCreateMultiple] =
		React.useState<boolean>(true);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		const checkOrganizationPermissions = async () => {
			const startTime = Date.now();
			try {
				// Use the new server action that checks user's organizations
				const result = await getUserPlanLimitsAction();
				setCanCreateMultiple(result.canCreateMultiple);
			} catch (error) {
				console.error("Failed to check organization permissions:", error);
				setCanCreateMultiple(true); // Default to allowed on error
			} finally {
				// Add a minimum delay to avoid loading flicker for fast responses
				const elapsed = Date.now() - startTime;
				const minDelay = 100; // 100ms minimum to avoid flicker
				if (elapsed < minDelay) {
					setTimeout(() => setLoading(false), minDelay - elapsed);
				} else {
					setLoading(false);
				}
			}
		};

		checkOrganizationPermissions();
	}, []);
	const filteredOrganizations = organizations.filter(
		(o) =>
			!searchQuery ||
			o.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
			o.slug.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
	);
	const handleSearchQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setSearchQuery(e.target?.value || "");
	};
	return (
		<Card className="border-none shadow-none bg-background">
			<CardHeader className="text-center">
				<CardTitle className="text-xl font-semibold leading-none tracking-tight">
					Organizations
				</CardTitle>
				<CardDescription className="hidden sm:block">
					Jump into an existing organization or add a new one.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center space-x-4">
					<InputSearch
						placeholder="Search..."
						value={searchQuery}
						onChange={handleSearchQueryChange}
					/>
					{canCreateMultiple && !loading ? (
						<Link
							href={routes.dashboard.onboarding.Organization}
							className={buttonVariants({
								variant: "default",
								className: "whitespace-nowrap",
							})}
						>
							<PlusIcon className="size-4 shrink-0" />
							<span className="hidden sm:inline">Add organization</span>
							<span className="inline sm:hidden">Add</span>
						</Link>
					) : !loading ? (
						<button
							type="button"
							onClick={() => NiceModal.show(UpgradePlanDialog)}
							className={buttonVariants({
								variant: "default",
								className: "whitespace-nowrap",
							})}
						>
							<SparklesIcon className="size-4 shrink-0" />
							<span className="hidden sm:inline">Upgrade to Add More</span>
							<span className="inline sm:hidden">Upgrade</span>
						</button>
					) : null}
				</div>
				{filteredOrganizations.length === 0 ? (
					<EmptyState
						icon={
							<div className="flex size-12 items-center justify-center rounded-md border">
								<StoreIcon className="size-6 shrink-0 text-muted-foreground" />
							</div>
						}
						title="No organization found"
						description={
							searchQuery
								? "Adjust your search query to show more."
								: "Add your first organization to get started."
						}
					/>
				) : (
					<ScrollArea className="*:data-radix-scroll-area-viewport:max-h-[calc(100svh-18rem)]">
						<div className="flex flex-col items-stretch justify-start gap-3">
							{filteredOrganizations.map((organization) => (
								<Link
									key={organization.id}
									href={replaceOrgSlug(
										routes.dashboard.organizations.slug.Home,
										organization.slug,
									)}
									className="group relative flex flex-col rounded-lg border transition-all hover:bg-secondary/20 bg-white dark:bg-input/30 dark:hover:bg-input/50"
								>
									<div className="flex h-full flex-row items-center justify-between p-4">
										<div className="flex flex-row items-center gap-2 transition-colors group-hover:text-secondary-foreground">
											<Avatar className="aspect-square size-6 rounded-md">
												<AvatarImage
													className="rounded-md"
													src={organization.logo}
												/>
												<AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
													{organization.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="text-sm font-medium">
													{organization.name}
												</div>
												<div className="text-xs text-muted-foreground">
													{getPathname(
														routes.dashboard.organizations.Index,
														baseUrl.Dashboard,
													)}
													/{organization.slug}
												</div>
											</div>
										</div>
										<div className="flex flex-row items-center gap-2">
											<div className="flex w-8 flex-row items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-secondary-foreground">
												<UserIcon className="size-3 shrink-0" />
												{organization.memberCount}
											</div>
											<ChevronRightIcon className="size-4 text-muted-foreground transition-colors group-hover:text-secondary-foreground" />
										</div>
									</div>
								</Link>
							))}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
