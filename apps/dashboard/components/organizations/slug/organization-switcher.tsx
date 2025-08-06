"use client";

import NiceModal from "@ebay/nice-modal-react";
import { replaceOrgSlug, routes } from "@workspace/routes";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { EmptyText } from "@workspace/ui/components/empty-text";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@workspace/ui/components/sidebar";
import {
	CheckIcon,
	ChevronsUpDownIcon,
	MoreHorizontalIcon,
	PlusIcon,
	SearchIcon,
	SettingsIcon,
	SparklesIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { getOrganizationLimitsAction } from "~/actions/organization/get-organization-limits";
import { UpgradePlanDialog } from "~/components/organizations/slug/settings/organization/billing/upgrade-plan-dialog";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import type { OrganizationDto } from "~/types/dtos/organization-dto";

export type OrganizationSwitcherProps = {
	organizations: OrganizationDto[];
};

export function OrganizationSwitcher({
	organizations,
}: OrganizationSwitcherProps): React.JSX.Element {
	const sidebar = useSidebar();
	const activeOrganization = useActiveOrganization();
	const [searchTerm, setSearchTerm] = React.useState("");
	const [canCreateMultiple, setCanCreateMultiple] =
		React.useState<boolean>(true);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		const checkOrganizationPermissions = async () => {
			try {
				// Use the server action instead of API endpoint
				const result = await getOrganizationLimitsAction();
				setCanCreateMultiple(result.canCreateMultiple);
			} catch (error) {
				console.error("Failed to check organization permissions:", error);
				setCanCreateMultiple(true); // Default to allowed on error
			} finally {
				setLoading(false);
			}
		};

		checkOrganizationPermissions();
	}, []);

	const filteredOrganizations = organizations.filter((organization) =>
		organization.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Sidebar on mobile is sometimes not properly reset
	const handleCloseSidebar = (): void => {
		sidebar.setOpenMobile(false);
		if (typeof window !== "undefined") {
			document.body.style.removeProperty("pointer-events");
		}
	};

	const handleOpenChange = (open: boolean): void => {
		if (open) {
			setSearchTerm("");
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu onOpenChange={handleOpenChange}>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="w-full px-1.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:p-1.5!">
							<Avatar className="aspect-square size-6 rounded-md">
								<AvatarImage
									className="rounded-md"
									src={activeOrganization.logo}
								/>
								<AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
									{activeOrganization.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-1 flex-row items-center gap-1 overflow-hidden">
								<span className="truncate text-sm font-semibold leading-tight">
									{activeOrganization.name}
								</span>
								<ChevronsUpDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56 min-w-56 rounded-lg"
						align="center"
						side="bottom"
						sideOffset={4}
					>
						<div className="relative">
							<SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full border-none! pl-8 shadow-none outline-none!"
							/>
						</div>
						<DropdownMenuSeparator />
						{filteredOrganizations.length === 0 ? (
							<EmptyText className="p-2">No organization found</EmptyText>
						) : (
							<ScrollArea className="-mr-1 pr-1 *:data-radix-scroll-area-viewport:max-h-[200px]">
								{filteredOrganizations.map((organization) => (
									<DropdownMenuItem
										key={organization.id}
										asChild
										className="cursor-pointer gap-2 p-2"
									>
										<Link
											href={replaceOrgSlug(
												routes.dashboard.organizations.slug.Home,
												organization.slug,
											)}
											onClick={handleCloseSidebar}
										>
											<Avatar className="aspect-square size-4 rounded-xs">
												<AvatarImage
													className="rounded-xs"
													src={organization.logo}
												/>
												<AvatarFallback className="flex size-4 items-center justify-center rounded-xs border border-neutral-200 bg-neutral-100 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
													{organization.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											{organization.name}
											{activeOrganization.id === organization.id && (
												<div className="ml-auto flex size-4 items-center justify-center rounded-full bg-blue-500 text-primary-foreground">
													<CheckIcon className="text-current size-3 shrink-0" />
												</div>
											)}
										</Link>
									</DropdownMenuItem>
								))}
							</ScrollArea>
						)}

						<DropdownMenuItem asChild className="cursor-pointer gap-2 p-2">
							<Link
								href={routes.dashboard.organizations.Index}
								className="text-muted-foreground"
								onClick={handleCloseSidebar}
							>
								<MoreHorizontalIcon className="size-4 shrink-0" />
								All organizations
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="cursor-pointer gap-2 p-2">
							<Link
								href={replaceOrgSlug(
									routes.dashboard.organizations.slug.settings.account.Index,
									activeOrganization.slug,
								)}
								onClick={handleCloseSidebar}
							>
								<UserIcon className="size-4 shrink-0 text-muted-foreground" />
								Account settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className="cursor-pointer gap-2 p-2">
							<Link
								href={replaceOrgSlug(
									routes.dashboard.organizations.slug.settings.organization
										.Index,
									activeOrganization.slug,
								)}
								onClick={handleCloseSidebar}
							>
								<SettingsIcon className="size-4 shrink-0 text-muted-foreground" />
								Organization settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{canCreateMultiple && !loading ? (
							<DropdownMenuItem asChild className="cursor-pointer gap-2 p-2">
								<Link
									href={routes.dashboard.onboarding.Organization}
									onClick={handleCloseSidebar}
								>
									<PlusIcon className="size-4 shrink-0 text-muted-foreground" />
									Add organization
								</Link>
							</DropdownMenuItem>
						) : !loading ? (
							<DropdownMenuItem
								className="cursor-pointer gap-2 p-2"
								onClick={() => {
									handleCloseSidebar();
									NiceModal.show(UpgradePlanDialog);
								}}
							>
								<SparklesIcon className="size-4 shrink-0 text-muted-foreground" />
								Upgrade
							</DropdownMenuItem>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
