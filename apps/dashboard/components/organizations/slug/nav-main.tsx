"use client";

import { baseUrl, getPathname } from "@workspace/routes";
import {
	SidebarGroup,
	type SidebarGroupProps,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";

import { createMainNavItems } from "~/components/organizations/slug/nav-items";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import { useHover } from "~/hooks/use-hover";

type NavMenuItemProps = {
	item: {
		title: string;
		href: string;
		disabled?: boolean;
		external?: boolean;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: React.ComponentType<any>;
	};
	isActive: boolean;
};

function NavMenuItem({ item, isActive }: NavMenuItemProps): React.JSX.Element {
	const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				isActive={isActive}
				tooltip={item.title}
				type="button"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className={cn(
					"w-full transition-colors duration-300",
					isActive ? "text-foreground" : "text-muted-foreground",
				)}
			>
				<Link
					href={item.disabled ? "#" : item.href}
					target={item.external ? "_blank" : undefined}
					onClick={(e) => {
						if (item.disabled) {
							e.preventDefault();
						}
					}}
				>
					<item.icon className="size-4 shrink-0" isHovered={isHovered} />
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export function NavMain(props: SidebarGroupProps): React.JSX.Element {
	const pathname = usePathname();
	const activeOrganization = useActiveOrganization();

	return (
		<SidebarGroup {...props}>
			<SidebarMenu>
				{createMainNavItems(activeOrganization.slug).map((item) => {
					const isActive = pathname.startsWith(
						getPathname(item.href, baseUrl.Dashboard),
					);

					return (
						<NavMenuItem key={item.href} item={item} isActive={isActive} />
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
