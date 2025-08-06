"use client";

import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type * as React from "react";

import { SimplePlanSelection } from "./simple-plan-selection";

export type PlanSelectionProps = React.HTMLAttributes<HTMLDivElement> & {
	backLink?: string;
	title: string;
	currentPlan?: "free" | "pro" | "unlimited";
};

export function PlanSelection({
	backLink,
	title,
	currentPlan = "free",
	className,
	...other
}: PlanSelectionProps): React.JSX.Element {
	return (
		<div className={cn("container py-12", className)} {...other}>
			{backLink && (
				<Link
					href={backLink}
					className={cn(buttonVariants({ variant: "link" }), "gap-1")}
				>
					<ArrowLeftIcon className="size-4 shrink-0" />
					Back
				</Link>
			)}
			<h1 className="text-center text-2xl">{title}</h1>
			<SimplePlanSelection currentPlan={currentPlan} className="mt-8" />
		</div>
	);
}
