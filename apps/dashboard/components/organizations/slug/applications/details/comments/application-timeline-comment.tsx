"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { formatDistanceToNow } from "date-fns";
import type * as React from "react";

import { getInitials } from "~/lib/formatters";
import type { ApplicationCommentDto } from "~/types/dtos/application-comment-dto";

type ApplicationTimelineCommentProps = {
	comment: ApplicationCommentDto;
};

export function ApplicationTimelineComment({
	comment,
}: ApplicationTimelineCommentProps): React.JSX.Element {
	// Convert date strings back to Date objects (Next.js serialization issue)
	const createdAt = new Date(comment.createdAt);

	return (
		<>
			<Avatar className="relative mt-3 size-6 flex-none rounded-full">
				<AvatarImage src={comment.sender.image} alt="avatar" />
				<AvatarFallback className="size-6 text-[10px]">
					{getInitials(comment.sender.name)}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-auto flex-row rounded-lg border p-4">
				<div className="flex-1 px-2">
					<div className="flex items-center gap-x-3">
						<div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
							<span className="font-medium text-gray-900">
								{comment.sender.name}
							</span>{" "}
							commented
						</div>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<time
									dateTime={createdAt.toISOString()}
									className="flex-none py-0.5 text-xs leading-5 text-gray-500 cursor-help"
								>
									{formatDistanceToNow(createdAt, { addSuffix: true })}
									{comment.edited && " (edited)"}
								</time>
							</TooltipTrigger>
						</Tooltip>
					</div>
					<p className="whitespace-pre-line text-sm mt-2">{comment.text}</p>
				</div>
			</div>
		</>
	);
}
