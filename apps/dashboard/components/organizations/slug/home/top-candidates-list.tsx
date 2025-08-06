"use client";

import { ContactRecord } from "@workspace/database/schema";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { ContactAvatar } from "~/components/organizations/slug/contacts/details/contact-avatar";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import type { TopCandidateDto } from "~/types/dtos/opportunity-dto";

export type TopCandidatesListProps = React.HTMLAttributes<HTMLDivElement> & {
	candidates: TopCandidateDto[];
};

export function TopCandidatesList({
	candidates,
	className,
	...other
}: TopCandidatesListProps): React.JSX.Element {
	return (
		<div className={cn("flex flex-col space-y-1", className)} {...other}>
			{candidates.map((candidate) => (
				<TopCandidatesListItem key={candidate.id} candidate={candidate} />
			))}
		</div>
	);
}

type TopCandidatesListItemProps = Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	"href"
> & {
	candidate: TopCandidateDto;
};

function TopCandidatesListItem({
	candidate,
	className,
	...other
}: TopCandidatesListItemProps): React.JSX.Element {
	const organization = useActiveOrganization();

	return (
		<Link
			href={`/organizations/${organization.slug}/applications/${candidate.id}`}
			className={cn(
				buttonVariants({ variant: "ghost", size: "default" }),
				"group w-full items-center justify-between px-3",
				className,
			)}
			{...other}
		>
			<div className="flex flex-row items-center gap-2">
				<ContactAvatar
					record={ContactRecord.PERSON}
					src={candidate.image}
					name={candidate.name}
					alt={candidate.name}
				/>
				<span className="text-sm font-normal truncate max-w-[120px]">
					{candidate.name}
				</span>
			</div>
			<span className="group-hover:hidden">
				{candidate.aiScore ? `${candidate.aiScore}%` : "—"}
			</span>
			<ArrowRightIcon className="hidden size-4 shrink-0 group-hover:inline" />
		</Link>
	);
}
