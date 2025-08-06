"use client";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "../lib/utils";

export type DialogElement = React.ComponentRef<typeof DialogPrimitive.Root>;
export type DialogProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Root
>;
function Dialog(props: DialogProps): React.JSX.Element {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export type DialogTriggerElement = React.ComponentRef<
	typeof DialogPrimitive.Trigger
>;
export type DialogTriggerProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Trigger
>;
function DialogTrigger(props: DialogTriggerProps): React.JSX.Element {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export type DialogPortalElement = React.ComponentRef<
	typeof DialogPrimitive.Portal
>;
export type DialogPortalProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Portal
>;
function DialogPortal(props: DialogPortalProps): React.JSX.Element {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export type DialogCloseElement = React.ComponentRef<
	typeof DialogPrimitive.Close
>;
export type DialogCloseProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Close
>;
function DialogClose(props: DialogCloseProps): React.JSX.Element {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export type DialogOverlayElement = React.ComponentRef<
	typeof DialogPrimitive.Overlay
>;
export type DialogOverlayProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Overlay
>;
function DialogOverlay({
	className,
	...props
}: DialogOverlayProps): React.JSX.Element {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"fill-mode-forwards! data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

export type DialogContentElement = React.ComponentRef<
	typeof DialogPrimitive.Content
>;
export type DialogContentProps = Omit<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
	"onEscapeKeyDown" | "onPointerDownOutside"
> & {
	showCloseButton?: boolean;
	onClose?: () => void;
};
function DialogContent({
	className,
	children,
	showCloseButton = true,
	onClose,
	...props
}: DialogContentProps): React.JSX.Element {
	const handleClose = (): void => {
		onClose?.();
	};
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					"fill-mode-forwards! bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200",
					className,
				)}
				onEscapeKeyDown={handleClose}
				onPointerDownOutside={handleClose}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className="cursor-pointer ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
						onClick={handleClose}
					>
						<XIcon />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

export type DialogHeaderElement = React.ComponentRef<"div">;
export type DialogHeaderProps = React.ComponentPropsWithoutRef<"div">;
function DialogHeader({
	className,
	...props
}: DialogHeaderProps): React.JSX.Element {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

export type DialogFooterElement = React.ComponentRef<"div">;
export type DialogFooterProps = React.ComponentPropsWithoutRef<"div">;
function DialogFooter({
	className,
	...props
}: DialogFooterProps): React.JSX.Element {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

export type DialogTitleElement = React.ComponentRef<
	typeof DialogPrimitive.Title
>;
export type DialogTitleProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Title
>;
function DialogTitle({
	className,
	...props
}: DialogTitleProps): React.JSX.Element {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

export type DialogDescriptionElement = React.ComponentRef<
	typeof DialogPrimitive.Description
>;
export type DialogDescriptionProps = React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Description
>;
function DialogDescription({
	className,
	...props
}: DialogDescriptionProps): React.JSX.Element {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
