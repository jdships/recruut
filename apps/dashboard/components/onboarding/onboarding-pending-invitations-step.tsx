"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { EmptyText } from "@workspace/ui/components/empty-text";
import { cn } from "@workspace/ui/lib/utils";
import { UserIcon } from "lucide-react";
import type * as React from "react";
import { useFormContext } from "react-hook-form";

import { NextButton } from "~/components/onboarding/next-button";
import type { OnboardingStepProps } from "~/components/onboarding/onboarding-step-props";
import type { CompleteOnboardingSchema } from "~/schemas/onboarding/complete-onboarding-schema";

export type OnboardingPendingInvitationsStepProps =
	React.HtmlHTMLAttributes<HTMLDivElement> & OnboardingStepProps;

export function OnboardingPendingInvitationsStep({
	metadata,
	canNext,
	loading,
	isLastStep,
	handleNext,
	className,
	...other
}: OnboardingPendingInvitationsStepProps): React.JSX.Element {
	const { watch, setValue } = useFormContext<CompleteOnboardingSchema>();
	const selectedInvitationIds = watch("pendingInvitationsStep.invitationIds");
	return (
		<div className={cn("flex w-full flex-col gap-4", className)} {...other}>
			<h1 className="text-3xl font-medium">Pending invitations</h1>
			<p className="text-base text-muted-foreground">
				Your team members have invited you to join their organization.
			</p>
			{metadata.invitations?.length ? (
				<div className="flex flex-col items-stretch justify-start gap-3 p-1">
					{metadata.invitations.map((invitation) => {
						const isSelected = selectedInvitationIds.includes(invitation.id);
						const handleInvitationToggle = () => {
							setValue(
								"pendingInvitationsStep.invitationIds",
								isSelected
									? selectedInvitationIds.filter((id) => id !== invitation.id)
									: [...selectedInvitationIds, invitation.id],
								{ shouldValidate: true },
							);
						};
						return (
							<label
								key={invitation.id}
								htmlFor={invitation.id}
								className="group relative flex cursor-pointer flex-row rounded-lg border p-4 transition-all hover:bg-secondary/20"
							>
								<div className="flex flex-1 flex-row items-center gap-4">
									<Checkbox
										id={invitation.id}
										checked={isSelected}
										onCheckedChange={handleInvitationToggle}
										className="shrink-0"
									/>
									<div className="flex flex-1 flex-row items-center gap-2">
										<Avatar className="aspect-square size-6 rounded-md">
											<AvatarImage
												className="rounded-md"
												src={invitation.organization.logo}
												alt="logo"
											/>
											<AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
												{invitation.organization.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="text-sm font-medium">
												{invitation.organization.name}
											</div>
											<div className="text-xs text-muted-foreground">
												/{invitation.organization.slug}
											</div>
										</div>
									</div>
								</div>
								<div className="flex w-8 flex-row items-center gap-1 text-xs text-muted-foreground">
									<UserIcon className="size-3 shrink-0" />
									<span>{invitation.organization.memberCount}</span>
								</div>
							</label>
						);
					})}
				</div>
			) : (
				<EmptyText className="rounded-lg border p-4">
					No pending invitations
				</EmptyText>
			)}
			<NextButton
				loading={loading}
				disabled={!canNext}
				isLastStep={isLastStep}
				onClick={handleNext}
			/>
		</div>
	);
}
