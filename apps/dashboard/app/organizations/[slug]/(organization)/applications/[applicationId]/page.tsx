import { routes } from "@workspace/routes";
import {
	Page,
	PageBody,
	PageHeader,
	PagePrimaryBar,
} from "@workspace/ui/components/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import * as React from "react";

import { ApplicationActions } from "~/components/organizations/slug/applications/details/application-actions";
import { ApplicationMeta } from "~/components/organizations/slug/applications/details/application-meta";
import { ApplicationPageVisit } from "~/components/organizations/slug/applications/details/application-page-visit";
import { ApplicationTabs } from "~/components/organizations/slug/applications/details/application-tabs";
import { OrganizationPageTitle } from "~/components/organizations/slug/organization-page-title";
import { getProfile } from "~/data/account/get-profile";
import { getApplication } from "~/data/applications/get-application";
import { getApplicationComments } from "~/data/applications/get-application-comments";
import { createTitle } from "~/lib/formatters";

const dedupedGetProfile = React.cache(getProfile);
const dedupedGetApplication = React.cache(getApplication);
const dedupedGetApplicationComments = React.cache(getApplicationComments);

const paramsCache = createSearchParamsCache({
	applicationId: parseAsString.withDefault(""),
});

type NextPageProps = {
	params: Promise<{ slug: string; applicationId: string }>;
};

export async function generateMetadata({
	params,
}: NextPageProps): Promise<Metadata> {
	const { applicationId } = await paramsCache.parse(params);

	if (applicationId) {
		const application = await dedupedGetApplication({
			id: applicationId,
		});
		if (application) {
			return {
				title: createTitle(`${application.name} - Application`),
			};
		}
	}

	return {
		title: createTitle("Application"),
	};
}

export default async function ApplicationPage({
	params,
}: NextPageProps): Promise<React.JSX.Element> {
	const { applicationId } = await paramsCache.parse(params);
	if (!applicationId) {
		return notFound();
	}

	const [profile, application, comments] = await Promise.all([
		dedupedGetProfile(),
		dedupedGetApplication({
			id: applicationId,
		}),
		dedupedGetApplicationComments({
			applicationId: applicationId,
		}),
	]);

	return (
		<Page>
			<PageHeader>
				<PagePrimaryBar>
					<OrganizationPageTitle
						index={{
							route: routes.dashboard.organizations.slug.Applications,
							title: "Applications",
						}}
						title={application.name}
					/>
					<ApplicationActions application={application} />
				</PagePrimaryBar>
			</PageHeader>
			<PageBody
				disableScroll
				className="flex h-full flex-col overflow-auto md:flex-row md:divide-x md:overflow-hidden"
			>
				<ApplicationPageVisit application={application} />
				<ApplicationMeta application={application} />
				<ApplicationTabs
					application={application}
					comments={comments}
					profile={profile}
				/>
			</PageBody>
		</Page>
	);
}
