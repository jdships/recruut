import { EmptyState } from "@workspace/ui/components/empty-state";
import { Separator } from "@workspace/ui/components/separator";
import {
	UnderlinedTabs,
	UnderlinedTabsContent,
	UnderlinedTabsList,
	UnderlinedTabsTrigger,
} from "@workspace/ui/components/tabs";
import { BotIcon, InfoIcon } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";

import { ApplicationComments } from "~/components/organizations/slug/applications/details/comments/application-comments";
import type { ApplicationCommentDto } from "~/types/dtos/application-comment-dto";
import type { ApplicationDto } from "~/types/dtos/application-dto";
import type { ProfileDto } from "~/types/dtos/profile-dto";

type ApplicationTabsProps = {
	application: ApplicationDto;
	comments: ApplicationCommentDto[];
	profile: ProfileDto;
};

enum Tab {
	Details = "details",
	Assessment = "assessment",
}

const tabList = [
	{
		value: Tab.Assessment,
		label: "AI Assessment",
		icon: BotIcon,
	},
	{
		value: Tab.Details,
		label: "Details",
		icon: InfoIcon,
	},
];

export function ApplicationTabs({
	application,
	comments,
	profile,
}: ApplicationTabsProps): React.JSX.Element {
	return (
		<UnderlinedTabs
			defaultValue={Tab.Assessment}
			className="flex size-full flex-col"
		>
			<UnderlinedTabsList className="h-12 max-h-12 min-h-12 gap-x-2 overflow-x-auto border-none px-4">
				{tabList.map((item) => (
					<UnderlinedTabsTrigger
						key={item.value}
						value={item.value}
						className="mx-0 border-t-4 border-t-transparent"
					>
						<div className="flex flex-row items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
							<item.icon className="size-4 shrink-0" />
							{item.label}
						</div>
					</UnderlinedTabsTrigger>
				))}
			</UnderlinedTabsList>
			<Separator />
			<UnderlinedTabsContent
				value={Tab.Details}
				className="m-0 p-6 md:grow md:overflow-hidden"
			>
				<div className="space-y-6">
					{application.submissionData && (
						<div>
							<h4 className="text-sm font-medium mb-3">
								Application Responses
							</h4>
							<div className="space-y-4">
								{Object.entries(application.submissionData).map(
									([key, value]) => (
										<div key={key} className="space-y-1">
											<dt className="text-sm font-medium text-muted-foreground">
												{key.charAt(0).toUpperCase() + key.slice(1)}
											</dt>
											<dd className="text-sm">
												{typeof value === "string"
													? value
													: JSON.stringify(value)}
											</dd>
										</div>
									),
								)}
							</div>
						</div>
					)}
					{application.resumeUrl && (
						<div>
							<h4 className="text-sm font-medium mb-3">Resume</h4>
							<a
								href={application.resumeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-sm text-primary hover:underline"
							>
								Download Resume
							</a>
						</div>
					)}
				</div>
			</UnderlinedTabsContent>
			<UnderlinedTabsContent
				value={Tab.Assessment}
				className="m-0 md:grow md:overflow-hidden"
			>
				<div className="flex h-full">
					{/* AI Assessment - 70% width */}
					<div className="w-[70%] p-6 overflow-auto">
						<div className="space-y-4">
							{application.aiAssessment ? (
								<div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
									<ReactMarkdown
										components={{
											h2: ({ children }) => (
												<h2 className="text-lg font-semibold text-foreground mt-6 mb-3 first:mt-0">
													{children}
												</h2>
											),
											h3: ({ children }) => (
												<h3 className="text-base font-medium text-foreground mt-4 mb-2">
													{children}
												</h3>
											),
											p: ({ children }) => (
												<p className="text-sm text-foreground/90 mb-3 leading-relaxed">
													{children}
												</p>
											),
											ul: ({ children }) => (
												<ul className="space-y-2 mb-4">{children}</ul>
											),
											li: ({ children }) => (
												<li className="text-sm text-foreground/90 leading-relaxed">
													{children}
												</li>
											),
											strong: ({ children }) => (
												<strong className="font-medium text-foreground">
													{children}
												</strong>
											),
											hr: () => <hr className="my-6 border-border" />,
										}}
									>
										{application.aiAssessment}
									</ReactMarkdown>
								</div>
							) : (
								<EmptyState
									title="No AI Assessment Available"
									description="This application doesn't have a comprehensive AI assessment yet. This feature generates detailed candidate evaluations to help with hiring decisions."
									icon={
										<div className="flex size-12 items-center justify-center rounded-md border">
											<BotIcon className="size-6 shrink-0 text-muted-foreground" />
										</div>
									}
									className="py-8"
								/>
							)}
						</div>
					</div>

					{/* Comments Section - 30% width */}
					<div className="w-[30%] border-l overflow-hidden">
						<React.Suspense
							fallback={<div className="p-6">Loading comments...</div>}
						>
							<ApplicationComments
								application={application}
								comments={comments}
								profile={profile}
							/>
						</React.Suspense>
					</div>
				</div>
			</UnderlinedTabsContent>
		</UnderlinedTabs>
	);
}
