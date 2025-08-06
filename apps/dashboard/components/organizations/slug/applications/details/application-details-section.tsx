"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
	BriefcaseIcon,
	ExternalLinkIcon,
	FlagIcon,
	GraduationCapIcon,
	IdCardIcon,
	MailIcon,
	PhoneIcon,
	PlaneIcon,
	StarIcon,
} from "lucide-react";
import type * as React from "react";

import type { ApplicationDto } from "~/types/dtos/application-dto";

export type ApplicationDetailsSectionProps =
	React.HtmlHTMLAttributes<HTMLDivElement> & {
		application: ApplicationDto;
	};

export function ApplicationDetailsSection({
	application,
	...others
}: ApplicationDetailsSectionProps): React.JSX.Element {
	return (
		<section {...others}>
			<ApplicationImage application={application} />
			<Properties application={application} />
		</section>
	);
}

function ApplicationImage({
	application,
}: {
	application: ApplicationDto;
}): React.JSX.Element {
	return (
		<div className="flex items-center justify-center p-6">
			<div className="relative">
				<Avatar className="size-28 rounded-full">
					{application.image && (
						<AvatarImage src={application.image} alt={application.name} />
					)}
					<AvatarFallback className="size-28 text-2xl rounded-full">
						{application.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.slice(0, 2)
							.toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</div>
		</div>
	);
}

function Properties({
	application,
}: {
	application: ApplicationDto;
}): React.JSX.Element {
	return (
		<div className="space-y-2 px-6 pb-6">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold tracking-tight">Details</h3>
			</div>
			<dl className="space-y-1 text-sm">
				<Property
					icon={<IdCardIcon className="size-4 shrink-0" />}
					term="Name"
					details={application.name}
					placeholder="No name available"
				/>
				<Property
					icon={<MailIcon className="size-4 shrink-0" />}
					term="Email"
					details={application.email}
					placeholder="No email available"
				/>
				{application.phone && (
					<Property
						icon={<PhoneIcon className="size-4 shrink-0" />}
						term="Phone"
						details={application.phone}
						placeholder="No phone available"
					/>
				)}
				{application.education && (
					<Property
						icon={<GraduationCapIcon className="size-4 shrink-0" />}
						term="Education"
						details={application.education}
						placeholder="No education available"
					/>
				)}
				{application.experience && (
					<Property
						icon={<BriefcaseIcon className="size-4 shrink-0" />}
						term="Experience"
						details={application.experience}
						placeholder="No experience available"
					/>
				)}
				{application.portfolioUrl && (
					<Property
						icon={<ExternalLinkIcon className="size-4 shrink-0" />}
						term="Portfolio"
						details={
							<a
								href={application.portfolioUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								View Portfolio
							</a>
						}
						placeholder="No portfolio available"
					/>
				)}
				{application.travelWillingness && (
					<Property
						icon={<PlaneIcon className="size-4 shrink-0" />}
						term="Travel"
						details={application.travelWillingness}
						placeholder="No travel preference available"
					/>
				)}
			</dl>

			{/* Application-specific sections */}
			<div className="space-y-2 pt-4 border-t text-sm">
				{application.aiScore !== undefined && (
					<Property
						icon={<StarIcon className="size-4 shrink-0" />}
						term="AI Score"
						details={
							<Badge variant="secondary">{application.aiScore}/100</Badge>
						}
						placeholder="No score available"
					/>
				)}
				{application.aiFlag && (
					<Property
						icon={<FlagIcon className="size-4 shrink-0" />}
						term="AI Flag"
						details={
							<Badge
								variant={
									application.aiFlag === "great"
										? "default"
										: application.aiFlag === "spam" ||
												application.aiFlag === "scam"
											? "destructive"
											: "secondary"
								}
							>
								{application.aiFlag}
							</Badge>
						}
						placeholder="No flag"
					/>
				)}
				{application.status && (
					<Property
						icon={<FlagIcon className="size-4 shrink-0" />}
						term="Status"
						details={<Badge variant="outline">{application.status}</Badge>}
						placeholder="No status"
					/>
				)}
			</div>
		</div>
	);
}

type PropertyProps = {
	icon: React.ReactNode;
	term: string;
	details: React.ReactNode;
	placeholder: string;
};

function Property({
	icon,
	term,
	details,
	placeholder,
}: PropertyProps): React.JSX.Element {
	return (
		<div className="flex min-h-7 flex-row items-start gap-2">
			<dt className="flex min-h-7 min-w-24 flex-row items-center gap-2 text-muted-foreground shrink-0">
				{icon}
				{term}
			</dt>
			<dd className="flex min-h-7 w-full flex-row items-center break-words">
				{details ? (
					details
				) : (
					<p className="text-muted-foreground opacity-65">{placeholder}</p>
				)}
			</dd>
		</div>
	);
}
