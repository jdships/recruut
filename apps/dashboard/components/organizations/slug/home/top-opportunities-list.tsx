"use client";

import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import type { TopOpportunityDto } from "~/types/dtos/opportunity-dto";

export type TopOpportunitiesListProps = React.HTMLAttributes<HTMLDivElement> & {
	opportunities: TopOpportunityDto[];
};

export function TopOpportunitiesList({
	opportunities,
	className,
	...other
}: TopOpportunitiesListProps): React.JSX.Element {
	return (
		<div className={cn("flex flex-col space-y-1", className)} {...other}>
			{opportunities.map((opportunity) => (
				<TopOpportunitiesListItem
					key={opportunity.id}
					opportunity={opportunity}
				/>
			))}
		</div>
	);
}

type TopOpportunitiesListItemProps = Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	"href"
> & {
	opportunity: TopOpportunityDto;
};

function TopOpportunitiesListItem({
	opportunity,
	className,
	...other
}: TopOpportunitiesListItemProps): React.JSX.Element {
	const organization = useActiveOrganization();

	return (
		<Link
			href={`/organizations/${organization.slug}/opportunities/${opportunity.id}`}
			className={cn(
				buttonVariants({ variant: "ghost", size: "default" }),
				"group w-full items-center justify-between px-3",
				className,
			)}
			{...other}
		>
			<div className="flex flex-row items-center gap-2">
				{/* Placeholder for avatar/icon */}
				<div className="rounded-full bg-muted w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground">
					{opportunity.title.charAt(0).toUpperCase()}
				</div>
				<span className="text-sm font-normal truncate max-w-[120px]">
					{opportunity.title}
				</span>
			</div>
			<span className="group-hover:hidden">{opportunity.submissionCount}</span>
			<ArrowRightIcon className="hidden size-4 shrink-0 group-hover:inline" />
		</Link>
	);
}
