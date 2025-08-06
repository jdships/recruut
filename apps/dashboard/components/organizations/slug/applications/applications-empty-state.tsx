import { EmptyState } from "@workspace/ui/components/empty-state";
import { UsersIcon } from "lucide-react";
import type * as React from "react";
import { CreateOpportunityButton } from "~/components/organizations/slug/home/create-opportunity-button";
import type { OpportunityLimitsData } from "~/data/opportunities/get-opportunity-limits";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export type ApplicationsEmptyStateProps = {
	user: ProfileDto;
	limitsData: OpportunityLimitsData;
};

export function ApplicationsEmptyState({
	user,
	limitsData,
}: ApplicationsEmptyStateProps): React.JSX.Element {
	return (
		<div className="p-6">
			<EmptyState
				icon={
					<div className="flex size-12 items-center justify-center rounded-md border">
						<UsersIcon className="size-6 shrink-0 text-muted-foreground" />
					</div>
				}
				title="No applications yet"
				description="Applications submitted by candidates will show up here."
			>
				<CreateOpportunityButton user={user} limitsData={limitsData} />
			</EmptyState>
		</div>
	);
}
