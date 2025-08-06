"use client";

import { ResponsiveScrollArea } from "@workspace/ui/components/scroll-area";
import { MediaQueries } from "@workspace/ui/lib/media-queries";
import type * as React from "react";

import { ApplicationTimeline } from "~/components/organizations/slug/applications/details/comments/application-timeline";
import type { ApplicationCommentDto } from "~/types/dtos/application-comment-dto";
import type { ApplicationDto } from "~/types/dtos/application-dto";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export type ApplicationCommentsProps = {
	application: ApplicationDto;
	comments: ApplicationCommentDto[];
	profile: ProfileDto;
};

export function ApplicationComments({
	application,
	comments,
	profile,
}: ApplicationCommentsProps): React.JSX.Element {
	return (
		<ResponsiveScrollArea
			breakpoint={MediaQueries.MdUp}
			mediaQueryOptions={{ ssr: true }}
			className="h-full"
		>
			<div className="size-full p-6">
				<ApplicationTimeline
					application={application}
					comments={comments}
					profile={profile}
				/>
			</div>
		</ResponsiveScrollArea>
	);
}
