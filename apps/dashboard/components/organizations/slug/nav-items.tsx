import { replaceOrgSlug, routes } from "@workspace/routes";
import { BookTextIcon } from "@workspace/ui/components/icons/contacts";
import { FileTextIcon } from "@workspace/ui/components/icons/file";
import { HomeIcon } from "@workspace/ui/components/icons/home";
import { SettingsGearIcon } from "@workspace/ui/components/icons/settings";
import { UsersIcon } from "@workspace/ui/components/icons/users";
import type { LucideIcon } from "lucide-react";
import {
	BellIcon,
	CreditCardIcon,
	LockKeyholeIcon,
	StoreIcon,
	UserIcon,
	UserPlus2Icon,
} from "lucide-react";
import type * as React from "react";

type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: LucideIcon | React.ComponentType<any>;
};

export function createMainNavItems(slug: string): NavItem[] {
	return [
		{
			title: "Home",
			href: replaceOrgSlug(routes.dashboard.organizations.slug.Home, slug),
			icon: HomeIcon,
		},
		{
			title: "Opportunities",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.Opportunities,
				slug,
			), // Update route if needed
			icon: FileTextIcon,
		},
		{
			title: "Applications",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.Applications,
				slug,
			), // Update route if needed
			icon: UsersIcon,
		},
		{
			title: "Contacts",
			href: replaceOrgSlug(routes.dashboard.organizations.slug.Contacts, slug), // Update route if needed
			icon: BookTextIcon,
		},
		{
			title: "Settings",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.Index,
				slug,
			),
			icon: SettingsGearIcon,
		},
	];
}

export function createAccountNavItems(slug: string): NavItem[] {
	return [
		{
			title: "Profile",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.account.Profile,
				slug,
			),
			icon: UserIcon,
		},
		{
			title: "Security",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.account.Security,
				slug,
			),
			icon: LockKeyholeIcon,
		},
		{
			title: "Notifications",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.account.Notifications,
				slug,
			),
			icon: BellIcon,
		},
	];
}

export function createOrganizationNavItems(slug: string): NavItem[] {
	return [
		{
			title: "General",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.organization.General,
				slug,
			),
			icon: StoreIcon,
		},
		{
			title: "Members",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.organization.Members,
				slug,
			),
			icon: UserPlus2Icon,
		},
		{
			title: "Billing",
			href: replaceOrgSlug(
				routes.dashboard.organizations.slug.settings.organization.Billing,
				slug,
			),
			icon: CreditCardIcon,
		},
	];
}
