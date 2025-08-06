import {
	Card,
	CardContent,
	CardHeader,
	type CardProps,
	CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type * as React from "react";

export type TopCandidatesSkeletonCardProps = CardProps;

export function TopCandidatesSkeletonCard(
	props: TopCandidatesSkeletonCardProps,
): React.JSX.Element {
	return (
		<Card {...props}>
			<CardHeader className="gap-0">
				<CardTitle className="text-sm">Top Candidates</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					{["a", "b", "c", "d", "e", "f"].map((key) => (
						<div
							key={key}
							className="flex h-9 flex-row items-center justify-between px-3"
						>
							<Skeleton className="mr-2 size-4 shrink-0" />
							<Skeleton className="h-5 w-40" />
							<Skeleton className="ml-auto size-5 shrink-0" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
