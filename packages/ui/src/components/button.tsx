import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer transition-all duration-300",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
				hero: "bg-blue-500 text-primary-foreground shadow-sm hover:bg-blue-600",
				primary:
					"bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline:
					"border border-input bg-background shadow-none hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-accent/70 text-accent-foreground shadow-none hover:bg-secondary",
				ghost: "hover:bg-accent/70 hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				"glitch-brightness":
					"group relative overflow-hidden rounded-xl px-4 py-2 text-primary-foreground duration-300 bg-primary hover:bg-primary/80",
			},

			size: {
				default: "h-9 px-4 py-2 text-sm",
				sm: "h-8 rounded-lg px-3 text-xs",
				lg: "h-10 rounded-lg px-4 py-2 text-sm",
				icon: "size-8",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

// Helper components for glitch-brightness variant
function TextGlitch({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative overflow-hidden flex items-center gap-2">
			<span className="invisible flex items-center gap-2">{children}</span>
			<span className="group-hover:-translate-y-full absolute top-0 left-0 transition-transform duration-500 ease-in-out hover:duration-300 flex items-center gap-2">
				{children}
			</span>
			<span className="absolute top-0 left-0 translate-y-full transition-transform duration-500 ease-in-out hover:duration-300 group-hover:translate-y-0 flex items-center gap-2">
				{children}
			</span>
		</div>
	);
}

function Brightness() {
	return (
		<div
			aria-hidden
			className="absolute inset-0 flex h-full w-full group-hover:animate-brightness justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
		>
			<div className="relative h-full w-8 bg-white/20 blur dark:bg-white/40" />
		</div>
	);
}

export type ButtonElement = React.ComponentRef<"button">;
export type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		loading?: boolean;
	};

function Button({
	className,
	variant,
	size,
	asChild = false,
	loading = false,
	children,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		loading?: boolean;
	}) {
	const Comp = asChild ? SlotPrimitive.Slot : "button";

	// Special handling for glitch-brightness variant
	if (variant === "glitch-brightness") {
		return (
			<Comp
				data-slot="button"
				className={cn(
					buttonVariants({ variant, size, className }),
					loading && "relative",
				)}
				{...props}
			>
				{loading ? (
					<>
						<span className={cn({ "opacity-0": loading })}>
							<TextGlitch>{children}</TextGlitch>
						</span>
						<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<Spinner />
						</span>
					</>
				) : (
					<>
						<TextGlitch>{children}</TextGlitch>
						<Brightness />
					</>
				)}
			</Comp>
		);
	}

	return (
		<Comp
			data-slot="button"
			className={cn(
				buttonVariants({ variant, size, className }),
				loading && "relative",
			)}
			{...props}
		>
			{loading ? (
				<>
					<span className={cn({ "opacity-0": loading })}>{children}</span>
					<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<Spinner />
					</span>
				</>
			) : (
				<>{children}</>
			)}
		</Comp>
	);
}

export { Button, buttonVariants };
