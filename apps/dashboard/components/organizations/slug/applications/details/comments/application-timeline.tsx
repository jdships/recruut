"use client";

import { Button } from "@workspace/ui/components/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

import { ApplicationTimelineAddComment } from "~/components/organizations/slug/applications/details/comments/application-timeline-add-comment";
import { ApplicationTimelineComment } from "~/components/organizations/slug/applications/details/comments/application-timeline-comment";
import type { ApplicationCommentDto } from "~/types/dtos/application-comment-dto";
import type { ApplicationDto } from "~/types/dtos/application-dto";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export type ApplicationTimelineProps = {
	application: ApplicationDto;
	comments: ApplicationCommentDto[];
	profile: ProfileDto;
};

type LineProps = {
	position: "start" | "middle" | "end";
};

function Line({ position }: LineProps): React.JSX.Element {
	return (
		<div
			className={`absolute left-5 top-0 flex w-0.5 justify-center bg-gray-200 ${
				position === "start"
					? "mt-3 h-full"
					: position === "end"
						? "h-5"
						: "h-full"
			}`}
		/>
	);
}

const threshold = 5;

export function ApplicationTimeline({
	application,
	comments,
	profile,
}: ApplicationTimelineProps): React.JSX.Element {
	const [showComments, setShowComments] = useState<boolean>(true);
	const [showMore, setShowMore] = useState<boolean>(false);

	const visibleComments = showComments ? comments : [];
	const amount = visibleComments.length;

	const handleToggleShowMore = (): void => {
		setShowMore((value) => !value);
	};

	return (
		<div className="overflow-visible border-none bg-transparent">
			<ul className="space-y-6">
				<li className="relative flex gap-x-4">
					<Line position="start" />
					<ApplicationTimelineAddComment
						profile={profile}
						application={application}
						showComments={showComments}
						onShowCommentsChange={setShowComments}
					/>
				</li>
				{visibleComments
					.slice(0, showMore ? amount : Math.min(amount, threshold))
					.map((comment, index) => (
						<li key={comment.id} className="relative flex gap-x-4 py-2">
							<Line
								position={
									index ===
									(showMore ? amount : Math.min(amount, threshold)) - 1
										? "end"
										: "middle"
								}
							/>
							<ApplicationTimelineComment comment={comment} />
						</li>
					))}
				{amount > threshold && (
					<li className="ml-8">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleToggleShowMore}
						>
							{showMore ? "Show less" : "Show more"}
							{showMore ? (
								<ChevronUpIcon className="ml-1 size-4 shrink-0" />
							) : (
								<ChevronDownIcon className="ml-1 size-4 shrink-0" />
							)}
						</Button>
					</li>
				)}
			</ul>
		</div>
	);
}
