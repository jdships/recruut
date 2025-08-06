"use client";

import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "../lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./dialog";

export type CommandElement = React.ComponentRef<typeof CommandPrimitive>;
export type CommandProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive
>;
function Command({ className, ...props }: CommandProps): React.JSX.Element {
	return (
		<CommandPrimitive
			data-slot="command"
			className={cn(
				"bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
				className,
			)}
			{...props}
		/>
	);
}

export type CommandDialogElement = React.ComponentRef<typeof Dialog>;
export type CommandDialogProps = React.ComponentPropsWithoutRef<
	typeof Dialog
> & {
	title?: string;
	description?: string;
	className?: string;
	showCloseButton?: boolean;
};
function CommandDialog({
	title = "Command Palette",
	description = "Search for a command to run...",
	children,
	className,
	showCloseButton = true,
	...props
}: CommandDialogProps): React.JSX.Element {
	return (
		<Dialog {...props}>
			<DialogHeader className="sr-only">
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogContent
				className={cn("overflow-hidden p-0", className)}
				showCloseButton={showCloseButton}
			>
				<Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
}

export type CommandInputElement = React.ComponentRef<
	typeof CommandPrimitive.Input
>;
export type CommandInputProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.Input
>;
function CommandInput({
	className,
	...props
}: CommandInputProps): React.JSX.Element {
	return (
		<div
			data-slot="command-input-wrapper"
			className="flex h-9 items-center gap-2 border-b px-3"
		>
			<SearchIcon className="size-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				data-slot="command-input"
				className={cn(
					"placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

export type CommandListElement = React.ComponentRef<
	typeof CommandPrimitive.List
>;
export type CommandListProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.List
>;
function CommandList({
	className,
	...props
}: CommandListProps): React.JSX.Element {
	return (
		<CommandPrimitive.List
			data-slot="command-list"
			className={cn(
				"max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
				className,
			)}
			{...props}
		/>
	);
}

export type CommandEmptyElement = React.ComponentRef<
	typeof CommandPrimitive.Empty
>;
export type CommandEmptyProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.Empty
>;
function CommandEmpty(props: CommandEmptyProps): React.JSX.Element {
	return (
		<CommandPrimitive.Empty
			data-slot="command-empty"
			className="py-6 text-center text-sm"
			{...props}
		/>
	);
}

export type CommandGroupElement = React.ComponentRef<
	typeof CommandPrimitive.Group
>;
export type CommandGroupProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.Group
>;
function CommandGroup({
	className,
	...props
}: CommandGroupProps): React.JSX.Element {
	return (
		<CommandPrimitive.Group
			data-slot="command-group"
			className={cn(
				"text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
				className,
			)}
			{...props}
		/>
	);
}

export type CommandSeparatorElement = React.ComponentRef<
	typeof CommandPrimitive.Separator
>;
export type CommandSeparatorProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.Separator
>;
function CommandSeparator({
	className,
	...props
}: CommandSeparatorProps): React.JSX.Element {
	return (
		<CommandPrimitive.Separator
			data-slot="command-separator"
			className={cn("bg-border -mx-1 h-px", className)}
			{...props}
		/>
	);
}

export type CommandItemElement = React.ComponentRef<
	typeof CommandPrimitive.Item
>;
export type CommandItemProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.Item
>;
function CommandItem({
	className,
	...props
}: CommandItemProps): React.JSX.Element {
	return (
		<CommandPrimitive.Item
			data-slot="command-item"
			className={cn(
				"data-[selected=true]:bg-accent rounded-sm data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

export type CommandShortcutElement = React.ComponentRef<"span">;
export type CommandShortcutProps = React.ComponentPropsWithoutRef<"span">;
function CommandShortcut({
	className,
	...props
}: CommandShortcutProps): React.JSX.Element {
	return (
		<span
			data-slot="command-shortcut"
			className={cn(
				"text-muted-foreground ml-auto text-xs tracking-widest",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
};
