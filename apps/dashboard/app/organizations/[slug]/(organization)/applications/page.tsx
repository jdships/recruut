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
import { ApplicationsDataTable } from "~/components/organizations/slug/applications/applications-data-table";
import { ApplicationsEmptyState } from "~/components/organizations/slug/applications/applications-empty-state";
import { ApplicationsFilters } from "~/components/organizations/slug/applications/applications-filters";
import { applicationsSearchParamsCache } from "~/components/organizations/slug/applications/applications-search-params";
import { CreateOpportunityButton } from "~/components/organizations/slug/home/create-opportunity-button";
import { OrganizationPageTitle } from "~/components/organizations/slug/organization-page-title";
import { getProfile } from "~/data/account/get-profile";
import { getApplications } from "~/data/applications/get-applications";
import { getOpportunities } from "~/data/opportunities/get-opportunities";
import { getOpportunityLimits } from "~/data/opportunities/get-opportunity-limits";
import { TransitionProvider } from "~/hooks/use-transition-context";
import { createTitle } from "~/lib/formatters";

export const metadata: Metadata = {
	title: createTitle("Applications"),
};

// ApplicationFlag enum values
const applicationFlags = [
	{ value: "normal", label: "Normal" },
	{ value: "spam", label: "Spam" },
	{ value: "scam", label: "Scam" },
	{ value: "highLevel", label: "High Level" },
	{ value: "great", label: "Great" },
];

export default async function ApplicationsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] };
}): Promise<React.JSX.Element> {
	const parsedSearchParams =
		await applicationsSearchParamsCache.parse(searchParams);

	// Fetch data in parallel
	const [
		{ applications, filteredCount, totalCount },
		opportunitiesRaw,
		profile,
		opportunityLimits,
	] = await Promise.all([
		getApplications(parsedSearchParams),
		getOpportunities(),
		getProfile(),
		getOpportunityLimits(),
	]);

	const hasAnyApplications = totalCount > 0;
	const opportunities = opportunitiesRaw.map((op) => ({
		value: op.id,
		label: op.title,
	}));

	return (
		<TransitionProvider>
			<Page>
				<PageHeader>
					<PagePrimaryBar>
						<OrganizationPageTitle
							title="Applications"
							info={`Total ${totalCount} ${totalCount === 1 ? "application" : "applications"} in your organization`}
						/>
						{hasAnyApplications && (
							<PageActions>
								<CreateOpportunityButton
									user={profile}
									limitsData={opportunityLimits}
								/>
							</PageActions>
						)}
					</PagePrimaryBar>

					<PageSecondaryBar>
						<React.Suspense>
							<ApplicationsFilters
								opportunities={opportunities}
								flags={applicationFlags}
							/>
						</React.Suspense>
					</PageSecondaryBar>
				</PageHeader>
				<PageBody disableScroll={hasAnyApplications}>
					{hasAnyApplications ? (
						<React.Suspense>
							<ApplicationsDataTable
								applications={applications}
								totalCount={filteredCount}
							/>
						</React.Suspense>
					) : (
						<ApplicationsEmptyState
							user={profile}
							limitsData={opportunityLimits}
						/>
					)}
				</PageBody>
			</Page>
		</TransitionProvider>
	);
}
