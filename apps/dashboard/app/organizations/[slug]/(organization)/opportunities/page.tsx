import {
	Page,
	PageActions,
	PageBody,
	PageHeader,
	PagePrimaryBar,
	PageSecondaryBar,
} from "@workspace/ui/components/page";
import type { Metadata } from "next";
import * as React from "react";
import { CreateOpportunityButton } from "~/components/organizations/slug/home/create-opportunity-button";
import { OpportunitiesDataTable } from "~/components/organizations/slug/opportunities/opportunities-data-table";
import { OpportunitiesEmptyState } from "~/components/organizations/slug/opportunities/opportunities-empty-state";
import { OpportunitiesFilters } from "~/components/organizations/slug/opportunities/opportunities-filters";
import { opportunitiesSearchParamsCache } from "~/components/organizations/slug/opportunities/opportunities-search-params";
import { OrganizationPageTitle } from "~/components/organizations/slug/organization-page-title";
import { getProfile } from "~/data/account/get-profile";
import { getOpportunitiesWithSubmissions } from "~/data/opportunities/get-opportunities";
import { getOpportunityLimits } from "~/data/opportunities/get-opportunity-limits";
import { TransitionProvider } from "~/hooks/use-transition-context";
import { createTitle } from "~/lib/formatters";

export const metadata: Metadata = {
	title: createTitle("Opportunities"),
};

export default async function OpportunitiesPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] };
}): Promise<React.JSX.Element> {
	await opportunitiesSearchParamsCache.parse(searchParams);

	// Fetch data in parallel
	const [rawOpportunities, profile, opportunityLimits] = await Promise.all([
		getOpportunitiesWithSubmissions(),
		getProfile(),
		getOpportunityLimits(),
	]);

	const opportunities = rawOpportunities.map((opp) => ({
		...opp,
		description: opp.description ?? "",
		createdAt:
			typeof opp.createdAt === "string"
				? opp.createdAt
				: opp.createdAt.toISOString(),
		avatars: (opp.avatars ?? []).map((a) => a ?? ""),
	}));
	const hasAnyOpportunities = opportunities.length > 0;

	return (
		<TransitionProvider>
			<Page>
				<PageHeader>
					<PagePrimaryBar>
						<OrganizationPageTitle
							title="Opportunities"
							info={`Total ${opportunities.length} ${opportunities.length === 1 ? "opportunity" : "opportunities"} in your organization`}
						/>
						{hasAnyOpportunities && (
							<PageActions>
								<CreateOpportunityButton
									user={profile}
									limitsData={opportunityLimits}
								/>
							</PageActions>
						)}
					</PagePrimaryBar>
					<PageSecondaryBar>
						<React.Suspense fallback={null}>
							<OpportunitiesFilters />
						</React.Suspense>
					</PageSecondaryBar>
				</PageHeader>
				<PageBody disableScroll={hasAnyOpportunities}>
					{hasAnyOpportunities ? (
						<React.Suspense fallback={null}>
							<OpportunitiesDataTable
								data={opportunities}
								totalCount={opportunities.length}
							/>
						</React.Suspense>
					) : (
						<OpportunitiesEmptyState
							user={profile}
							limitsData={opportunityLimits}
						/>
					)}
				</PageBody>
			</Page>
		</TransitionProvider>
	);
}
