"use client";

import { Role } from "@workspace/database/schema";
import { routes } from "@workspace/routes";
import { FormProvider } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { type Theme, useTheme } from "@workspace/ui/hooks/use-theme";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { SubmitHandler } from "react-hook-form";

import { completeOnboarding } from "~/actions/onboarding/complete-onboarding";
import { OnboardingInviteTeamStep } from "~/components/onboarding/onboarding-invite-team-step";
import { OnboardingOrganizationStep } from "~/components/onboarding/onboarding-organization-step";
import { OnboardingPendingInvitationsStep } from "~/components/onboarding/onboarding-pending-invitations-step";
import { OnboardingProfileStep } from "~/components/onboarding/onboarding-profile-step";
import type { OnboardingMetadata } from "~/components/onboarding/onboarding-step-props";
import { OnboardingThemeStep } from "~/components/onboarding/onboarding-theme-step";
import { StepIndicator } from "~/components/onboarding/step-indicator";
import { useZodForm } from "~/hooks/use-zod-form";
import { FileUploadAction } from "~/lib/file-upload";
import {
	type CompleteOnboardingSchema,
	completeOnboardingSchema,
	inviteTeamOnboardingSchema,
	OnboardingStep,
	organizationOnboardingSchema,
	pendingInvitationsOnboardingSchema,
	profileOnboardingSchema,
	themeOnboardingSchema,
} from "~/schemas/onboarding/complete-onboarding-schema";

const components = {
	[OnboardingStep.Profile]: OnboardingProfileStep,
	[OnboardingStep.Theme]: OnboardingThemeStep,
	[OnboardingStep.Organization]: OnboardingOrganizationStep,
	[OnboardingStep.InviteTeam]: OnboardingInviteTeamStep,
	[OnboardingStep.PendingInvitations]: OnboardingPendingInvitationsStep,
} as const;

function validateStep(
	step: OnboardingStep,
	values: CompleteOnboardingSchema,
): boolean {
	switch (step) {
		case OnboardingStep.Profile:
			return profileOnboardingSchema.safeParse(values.profileStep).success;
		case OnboardingStep.Theme:
			return themeOnboardingSchema.safeParse(values.themeStep).success;
		case OnboardingStep.Organization:
			return organizationOnboardingSchema.safeParse(values.organizationStep)
				.success;
		case OnboardingStep.InviteTeam:
			return inviteTeamOnboardingSchema.safeParse(values.inviteTeamStep)
				.success;
		case OnboardingStep.PendingInvitations:
			return pendingInvitationsOnboardingSchema.safeParse(
				values.pendingInvitationsStep,
			).success;
	}
}

function handleScrollToTop(): void {
	if (typeof window !== "undefined") {
		window.scrollTo(0, 0);
	}
}

export type OnboardingWizardProps =
	React.HtmlHTMLAttributes<HTMLFormElement> & {
		activeSteps: OnboardingStep[];
		metadata: OnboardingMetadata;
	};

export function OnboardingWizard({
	activeSteps,
	metadata,
	className,
	...other
}: OnboardingWizardProps): React.JSX.Element {
	const router = useRouter();
	const { theme } = useTheme();
	const [currentStep, setCurrentStep] = React.useState<OnboardingStep>(
		activeSteps[0],
	);
	const methods = useZodForm({
		schema: completeOnboardingSchema,
		mode: "all",
		defaultValues: {
			activeSteps,
			profileStep: activeSteps.includes(OnboardingStep.Profile)
				? {
						action: FileUploadAction.None,
						image: metadata?.user?.image ?? undefined,
						name: metadata?.user?.name ?? "Unkown",
						phone: metadata?.user?.phone ?? "",
						email: metadata?.user?.email ?? "",
					}
				: undefined,
			themeStep: activeSteps.includes(OnboardingStep.Theme)
				? {
						theme: (theme as Theme) ?? "system",
					}
				: undefined,
			organizationStep: activeSteps.includes(OnboardingStep.Organization)
				? {
						logo: metadata?.organization?.logo ?? undefined,
						name: metadata?.organization?.name ?? "",
						slug: metadata?.organization?.slug ?? "",
					}
				: undefined,
			inviteTeamStep: activeSteps.includes(OnboardingStep.InviteTeam)
				? {
						invitations: [
							{ email: "", role: Role.MEMBER },
							{ email: "", role: Role.MEMBER },
							{ email: "", role: Role.MEMBER },
						],
					}
				: undefined,
			pendingInvitationsStep: activeSteps.includes(
				OnboardingStep.PendingInvitations,
			)
				? {
						invitationIds:
							metadata?.invitations?.map((invitation) => invitation.id) ?? [],
					}
				: undefined,
		},
	});
	const Component = components[currentStep];
	const currentStepIndex = activeSteps.indexOf(currentStep);
	const isLastStep = currentStepIndex === activeSteps.length - 1;
	const formValues = methods.getValues();
	const isCurrentStepValid = validateStep(currentStep, formValues);
	const canSubmit =
		!methods.formState.isSubmitting && methods.formState.isValid;
	const onSubmit: SubmitHandler<CompleteOnboardingSchema> = async (values) => {
		if (!canSubmit || !isCurrentStepValid || !isLastStep) {
			return;
		}

		const result = await completeOnboarding(values);
		if (!result?.serverError && !result?.validationErrors) {
			toast.success("Completed and ready to go!");
			router.push(
				result?.data?.redirect ?? routes.dashboard.organizations.Index,
			);
		} else {
			toast.error("Couldn't complete request");
		}
	};
	const handleNext = async (): Promise<void> => {
		if (!isCurrentStepValid) {
			return;
		}
		if (isLastStep) {
			methods.handleSubmit(onSubmit)();
			return;
		}
		setCurrentStep(activeSteps[currentStepIndex + 1]);
		handleScrollToTop();
	};
	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className={cn(
					"mx-auto w-full min-w-80 max-w-lg space-y-4 p-4 pt-24",
					className,
				)}
				{...other}
			>
				<div className="w-48 space-y-4">
					<p className="text-sm text-muted-foreground">
						Step {currentStepIndex + 1} of {activeSteps.length}
					</p>
					<StepIndicator
						steps={activeSteps}
						currentStep={currentStep}
						setCurrentStep={setCurrentStep}
					/>
				</div>
				<Component
					metadata={metadata}
					canNext={isCurrentStepValid && !methods.formState.isSubmitting}
					loading={methods.formState.isSubmitting}
					isLastStep={isLastStep}
					handleNext={handleNext}
				/>
			</form>
		</FormProvider>
	);
}
