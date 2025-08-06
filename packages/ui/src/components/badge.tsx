import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "../lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-accent text-accent-foreground",
				destructive: "border-destructive/20 bg-destructive/20 text-destructive",
				outline: "border bg-background text-muted-foreground",
				success: "border-green-500/20 bg-green-500/20 text-green-600",
				highLevel: "border-blue-500/20 bg-blue-500/20 text-blue-600",
				warning: "border-amber-500/20 bg-amber-500/20 text-amber-600",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type BadgeElement = React.ComponentRef<"span">;
export type BadgeProps = React.ComponentPropsWithoutRef<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean };
function Badge({
	className,
	variant,
	asChild = false,
	...props
}: BadgeProps): React.JSX.Element {
	const Comp = asChild ? SlotPrimitive.Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
