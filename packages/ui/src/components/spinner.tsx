import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import type * as React from "react";

import { cn } from "../lib/utils";

const spinnerVariants = cva("flex-col items-center justify-center", {
	variants: {
		show: {
			true: "flex",
			false: "hidden",
		},
	},
	defaultVariants: {
		show: true,
	},
});

const loaderVariants = cva("animate-spin text-current", {
	variants: {
		size: {
			small: "size-2 shrink-0",
			medium: "size-4 shrink-0",
			large: "size-8 shrink-0 text-primary",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

export type SpinnerElement = React.ComponentRef<"span">;
export type SpinnerProps = React.ComponentPropsWithoutRef<"span"> &
	VariantProps<typeof spinnerVariants> &
	VariantProps<typeof loaderVariants> & {
		children?: React.ReactNode;
	};
function Spinner({
	size,
	show,
	children,
	className,
	...props
}: SpinnerProps): React.JSX.Element {
	return (
		<span className={cn(spinnerVariants({ show }), className)} {...props}>
			<Loader2Icon className={cn(loaderVariants({ size }))} />
			{children}
		</span>
	);
}

export type CenteredSpinnerElement = React.ComponentRef<"div">;
export type CenteredSpinnerProps = React.ComponentPropsWithoutRef<"div"> &
	SpinnerProps & {
		containerClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
	};
function CenteredSpinner({
	containerClassName,
	...props
}: CenteredSpinnerProps): React.JSX.Element {
	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 flex select-none items-center justify-center opacity-65",
				containerClassName,
			)}
		>
			<Spinner {...props} />
		</div>
	);
}

export { CenteredSpinner, Spinner };
