"use client";

import NiceModal from "@ebay/nice-modal-react";
import { CommandShortcut } from "@workspace/ui/components/command";
import { SearchIcon } from "@workspace/ui/components/icons/search";
import {
	SidebarMenuButton,
	useSidebar,
} from "@workspace/ui/components/sidebar";
import * as React from "react";
import { useHover } from "~/hooks/use-hover";
import { CommandMenu } from "./command-menu";

export function QuickActionsButton(): React.JSX.Element {
	const { state, isMobile } = useSidebar();
	const [shortcutKey, setShortcutKey] = React.useState("Ctrl");
	const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();

	React.useEffect(() => {
		if (navigator.platform.includes("Mac")) {
			setShortcutKey("⌘");
		} else {
			setShortcutKey("Ctrl");
		}
	}, []);

	// Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Win/Linux)
	React.useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				NiceModal.show(CommandMenu);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	if (state === "collapsed" && !isMobile) {
		return (
			<SidebarMenuButton
				className="w-full flex items-center justify-center p-2 rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent/50 hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
				onClick={() => NiceModal.show(CommandMenu)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				tooltip="Search"
				aria-label="Search"
			>
				<SearchIcon
					className="size-5 transition-colors hover:text-sidebar-accent-foreground flex items-center justify-center"
					isHovered={isHovered}
				/>
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuButton
			className="w-full hidden sm:flex items-center gap-2 rounded-md border border-border bg-background px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 justify-center mx-auto"
			onClick={() => NiceModal.show(CommandMenu)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			aria-label="Quick actions search"
		>
			<SearchIcon
				className="size-4 shrink-0 opacity-60 transition-colors hover:text-sidebar-accent-foreground"
				isHovered={isHovered}
			/>
			<span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis text-xs transition-colors hover:text-sidebar-accent-foreground">
				Search...
			</span>
			<CommandShortcut>
				<span className="inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none bg-sidebar-accent">
					{shortcutKey}K
				</span>
			</CommandShortcut>
		</SidebarMenuButton>
	);
}
