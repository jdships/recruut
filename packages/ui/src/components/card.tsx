import type * as React from "react";

import { cn } from "../lib/utils";

export type CardElement = React.ComponentRef<"div">;
export type CardProps = React.ComponentPropsWithoutRef<"div">;
function Card({ className, ...props }: CardProps): React.JSX.Element {
	return (
		<div
			data-slot="card"
			className={cn(
				"bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6",
				className,
			)}
			{...props}
		/>
	);
}

export type CardHeaderElement = React.ComponentRef<"div">;
export type CardHeaderProps = React.ComponentPropsWithoutRef<"div">;
function CardHeader({
	className,
	...props
}: CardHeaderProps): React.JSX.Element {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

export type CardTitleElement = React.ComponentRef<"div">;
export type CardTitleProps = React.ComponentPropsWithoutRef<"div">;
function CardTitle({ className, ...props }: CardTitleProps): React.JSX.Element {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

export type CardDescriptionElement = React.ComponentRef<"div">;
export type CardDescriptionProps = React.ComponentPropsWithoutRef<"div">;
function CardDescription({
	className,
	...props
}: CardDescriptionProps): React.JSX.Element {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export type CardActionElement = React.ComponentRef<"div">;
export type CardActionProps = React.ComponentPropsWithoutRef<"div">;
function CardAction({
	className,
	...props
}: CardActionProps): React.JSX.Element {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

export type CardContentElement = React.ComponentRef<"div">;
export type CardContentProps = React.ComponentPropsWithoutRef<"div">;
function CardContent({
	className,
	...props
}: CardContentProps): React.JSX.Element {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6", className)}
			{...props}
		/>
	);
}

export type CardFooterElement = React.ComponentRef<"div">;
export type CardFooterProps = React.ComponentPropsWithoutRef<"div">;
function CardFooter({
	className,
	...props
}: CardFooterProps): React.JSX.Element {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
