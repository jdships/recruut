"use client";

import { ResponsiveScrollArea } from "@workspace/ui/components/scroll-area";
import { MediaQueries } from "@workspace/ui/lib/media-queries";
import type * as React from "react";

import { ApplicationDetailsSection } from "~/components/organizations/slug/applications/details/application-details-section";
import { ApplicationScoreSection } from "~/components/organizations/slug/applications/details/application-score-section";
import { ApplicationStatusSection } from "~/components/organizations/slug/applications/details/application-status-section";
import type { ApplicationDto } from "~/types/dtos/application-dto";

export type ApplicationMetaProps = {
	application: ApplicationDto;
};

export function ApplicationMeta({
	application,
}: ApplicationMetaProps): React.JSX.Element {
	return (
		<ResponsiveScrollArea
			breakpoint={MediaQueries.MdUp}
			mediaQueryOptions={{ ssr: true }}
			className="sm:h-full"
		>
			<div className="size-full divide-y border-b md:w-[380px] md:min-w-[380px]">
				<ApplicationDetailsSection application={application} />
				<ApplicationStatusSection application={application} />
				<ApplicationScoreSection application={application} />
			</div>
		</ResponsiveScrollArea>
	);
}
