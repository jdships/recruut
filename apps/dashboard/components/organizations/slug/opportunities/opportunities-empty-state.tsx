import { EmptyState } from "@workspace/ui/components/empty-state";
import { BriefcaseIcon } from "lucide-react";
import * as React from "react";
import type { OpportunityLimitsData } from "~/data/opportunities/get-opportunity-limits";
import { CreateOpportunityButton } from "../home/create-opportunity-button";

export type OpportunitiesEmptyStateProps = {
	user: { id: string; name?: string; email?: string };
	limitsData: OpportunityLimitsData;
};

export function OpportunitiesEmptyState({
	user,
	limitsData,
}: OpportunitiesEmptyStateProps) {
	return (
		<div className="p-6">
			<EmptyState
				icon={
					<div className="flex size-12 items-center justify-center rounded-md border">
						<BriefcaseIcon className="size-6 shrink-0 text-muted-foreground" />
					</div>
				}
				title="No opportunities yet"
				description="Opportunities you create will show up here."
			>
				<CreateOpportunityButton user={user} limitsData={limitsData} />
			</EmptyState>
		</div>
	);
}
