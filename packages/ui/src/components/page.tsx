import type * as React from "react";

import { cn } from "../lib/utils";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { SidebarTrigger } from "./sidebar";

export type PageElement = HTMLDivElement;
export type PageProps = React.ComponentProps<"div">;
function Page({ children, className, ...other }: PageProps): React.JSX.Element {
	return (
		<div className={cn("flex h-full flex-col", className)} {...other}>
			{children}
		</div>
	);
}

export type PageHeaderElement = HTMLDivElement;
export type PageHeaderProps = React.ComponentProps<"div">;
function PageHeader({
	className,
	children,
	...other
}: PageHeaderProps): React.JSX.Element {
	return (
		<div className={cn("sticky top-0 z-20 bg-card", className)} {...other}>
			{children}
		</div>
	);
}

export type PagePrimaryBarElement = HTMLDivElement;
export type PagePrimaryBarProps = React.ComponentProps<"div">;
function PagePrimaryBar({
	className,
	children,
	...other
}: PagePrimaryBarProps): React.JSX.Element {
	return (
		<div
			className={cn(
				"relative flex h-14 flex-row items-center gap-1 border-b px-4 sm:px-6",
				className,
			)}
			{...other}
		>
			<SidebarTrigger />
			<Separator orientation="vertical" className="mr-2 h-4!" />
			<div className="flex w-full flex-row items-center justify-between">
				{children}
			</div>
		</div>
	);
}

export type PageTitleElement = HTMLHeadingElement;
export type PageTitleProps = React.ComponentProps<"h1">;
function PageTitle({
	className,
	children,
	...other
}: PageTitleProps): React.JSX.Element {
	return (
		<h1 className={cn("text-sm font-semibold", className)} {...other}>
			{children}
		</h1>
	);
}

export type PageActionsElement = HTMLDivElement;
export type PageActionsProps = React.ComponentProps<"div">;
function PageActions({
	className,
	children,
	...other
}: PageActionsProps): React.JSX.Element {
	return (
		<div className={cn("flex items-center gap-2", className)} {...other}>
			{children}
		</div>
	);
}

export type PageSecondaryBarElement = HTMLDivElement;
export type PageSecondaryBarProps = React.ComponentProps<"div">;
function PageSecondaryBar({
	className,
	children,
	...other
}: PageSecondaryBarProps): React.JSX.Element {
	return (
		<div
			className={cn(
				"relative flex h-12 items-center justify-between gap-2 border-b px-4 sm:px-6",
				className,
			)}
			{...other}
		>
			{children}
		</div>
	);
}

export type PageBodyElement = HTMLDivElement;
export type PageBodyProps = React.ComponentProps<"div"> & {
	disableScroll?: boolean;
};
function PageBody({
	children,
	className,
	disableScroll = false,
	...other
}: PageBodyProps): React.JSX.Element {
	if (disableScroll) {
		return (
			<div className={cn("flex h-full flex-col", className)} {...other}>
				{children}
			</div>
		);
	}

	return (
		<div className={cn("grow overflow-hidden", className)} {...other}>
			<ScrollArea className="h-full">{children}</ScrollArea>
		</div>
	);
}

export {
	Page,
	PageActions,
	PageBody,
	PageHeader,
	PagePrimaryBar,
	PageSecondaryBar,
	PageTitle,
};
