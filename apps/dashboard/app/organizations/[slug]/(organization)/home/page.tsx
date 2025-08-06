import {
	Page,
	PageActions,
	PageBody,
	PageHeader,
	PagePrimaryBar,
	PageSecondaryBar,
} from "@workspace/ui/components/page";
import type { Metadata } from "next";
import type * as React from "react";
import { CreateOpportunityButton } from "~/components/organizations/slug/home/create-opportunity-button";
import { HomeContent } from "~/components/organizations/slug/home/home-content";
import { HomeFilters } from "~/components/organizations/slug/home/home-filters";
import { searchParamsCache } from "~/components/organizations/slug/home/home-search-params";
import { LeadGenerationCard } from "~/components/organizations/slug/home/lead-generation-card";
import { TopCandidatesCard } from "~/components/organizations/slug/home/top-candidates-card";
import { TopOpportunitiesCard } from "~/components/organizations/slug/home/top-opportunities-card";
import { OrganizationPageTitle } from "~/components/organizations/slug/organization-page-title";
import { getProfile } from "~/data/account/get-profile";
import { getLeadGenerationData } from "~/data/home/get-lead-generation-data";
import { getTopCandidates } from "~/data/home/get-top-candidates";
import { getTopOpportunities } from "~/data/home/get-top-opportunities";
import { getOpportunityLimits } from "~/data/opportunities/get-opportunity-limits";
import { TransitionProvider } from "~/hooks/use-transition-context";
import { createTitle } from "~/lib/formatters";

export const metadata: Metadata = {
	title: createTitle("Home"),
};

export default async function HomePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] };
}): Promise<React.JSX.Element> {
	const parsedSearchParams = await searchParamsCache.parse(searchParams);

	// Fetch all data in parallel
	const [
		profile,
		opportunities,
		candidates,
		leadGenerationData,
		opportunityLimits,
	] = await Promise.all([
		getProfile(),
		getTopOpportunities(parsedSearchParams),
		getTopCandidates(parsedSearchParams),
		getLeadGenerationData(parsedSearchParams),
		getOpportunityLimits(),
	]);

	// Create the card components
	const leadGeneration = (
		<LeadGenerationCard data={leadGenerationData} user={profile} />
	);
	const topOpportunities = (
		<TopOpportunitiesCard
			opportunities={opportunities}
			className="col-span-2 md:col-span-1"
		/>
	);
	const topCandidates = (
		<TopCandidatesCard
			candidates={candidates}
			className="col-span-2 md:col-span-1"
		/>
	);

	return (
		<TransitionProvider>
			<Page>
				<PageHeader>
					<PagePrimaryBar>
						<OrganizationPageTitle
							title="Overview"
							info=" Lead and contact engagement metrics"
						/>
						<PageActions>
							<CreateOpportunityButton
								user={profile}
								limitsData={opportunityLimits}
							/>
						</PageActions>
					</PagePrimaryBar>
					<PageSecondaryBar>
						<HomeFilters />
					</PageSecondaryBar>
				</PageHeader>
				<PageBody>
					<HomeContent
						leadGeneration={leadGeneration}
						topOpportunities={topOpportunities}
						topCandidates={topCandidates}
						profile={profile}
					/>
				</PageBody>
			</Page>
		</TransitionProvider>
	);
}
