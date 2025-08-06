import {
	Card,
	CardContent,
	CardHeader,
	type CardProps,
	CardTitle,
} from "@workspace/ui/components/card";
import { BarChart2 } from "lucide-react";
import type * as React from "react";
import type { TopOpportunityDto } from "~/types/dtos/opportunity-dto";
import { TopOpportunitiesList } from "./top-opportunities-list";

export type TopOpportunitiesCardProps = CardProps & {
	opportunities: TopOpportunityDto[];
};

export function TopOpportunitiesCard({
	opportunities,
	...props
}: TopOpportunitiesCardProps): React.JSX.Element {
	const hasOpportunities = opportunities.length > 0;
	return (
		<Card {...props}>
			<CardHeader className="gap-0">
				<CardTitle className="text-sm">Top Opportunities</CardTitle>
			</CardHeader>
			<CardContent>
				{hasOpportunities ? (
					<TopOpportunitiesList opportunities={opportunities} />
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
