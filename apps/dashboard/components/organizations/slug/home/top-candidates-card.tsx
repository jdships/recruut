import {
	Card,
	CardContent,
	CardHeader,
	type CardProps,
	CardTitle,
} from "@workspace/ui/components/card";
import { BarChart2 } from "lucide-react";
import type * as React from "react";
import type { TopCandidateDto } from "~/types/dtos/opportunity-dto";
import { TopCandidatesList } from "./top-candidates-list";

export type TopCandidatesCardProps = CardProps & {
	candidates: TopCandidateDto[];
};

export function TopCandidatesCard({
	candidates,
	...props
}: TopCandidatesCardProps): React.JSX.Element {
	const hasCandidates = candidates.length > 0;
	return (
		<Card {...props}>
			<CardHeader className="gap-0">
				<CardTitle className="text-sm">Top Candidates</CardTitle>
			</CardHeader>
			<CardContent>
				{hasCandidates ? (
					<TopCandidatesList candidates={candidates} />
				) : (
					<div className="flex flex-col items-center justify-center h-40 text-center gap-2">
						<div className="flex size-12 items-center justify-center rounded-md border">
							<BarChart2 className="size-6 shrink-0 text-muted-foreground" />
						</div>
						<p className="mt-2 text-base font-medium text-foreground">
							No data to show
						</p>
						<p className="text-sm text-muted-foreground">
							Data may take up to 24 hours to load
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
