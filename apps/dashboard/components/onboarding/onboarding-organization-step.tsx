"use client";

import NiceModal from "@ebay/nice-modal-react";
import { baseUrl, getPathname, routes } from "@workspace/routes";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@workspace/ui/components/form";
import { ImageDropzone } from "@workspace/ui/components/image-dropzone";
import { Input } from "@workspace/ui/components/input";
import { toast } from "@workspace/ui/components/sonner";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { TrashIcon, UploadIcon } from "lucide-react";
import type * as React from "react";
import { useFormContext } from "react-hook-form";

import { checkIfSlugIsAvailable } from "~/actions/organization/check-if-slug-is-available";
import { NextButton } from "~/components/onboarding/next-button";
import type { OnboardingStepProps } from "~/components/onboarding/onboarding-step-props";
import { CropPhotoModal } from "~/components/organizations/slug/settings/account/profile/crop-photo-modal";
import { MAX_IMAGE_SIZE } from "~/lib/file-upload";
import type { CompleteOnboardingSchema } from "~/schemas/onboarding/complete-onboarding-schema";

function slugify(str: string): string {
	return str.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

export type OnboardingOrganizationStepProps =
	React.HtmlHTMLAttributes<HTMLDivElement> & OnboardingStepProps;

export function OnboardingOrganizationStep({
	canNext,
	loading,
	isLastStep,
	handleNext,
	className,
	...other
}: OnboardingOrganizationStepProps): React.JSX.Element {
	const methods = useFormContext<CompleteOnboardingSchema>();
	const logo = methods.watch("organizationStep.logo");
	const slug = methods.watch("organizationStep.slug");
	const handleDrop = async (files: File[]): Promise<void> => {
		if (files && files.length > 0) {
			const file = files[0];
			if (file.size > MAX_IMAGE_SIZE) {
				toast.error(
					`Uploaded image shouldn't exceed ${MAX_IMAGE_SIZE / 1000000} MB size limit`,
				);
			} else {
				const base64Image: string = await NiceModal.show(CropPhotoModal, {
					file,
					aspectRatio: 1,
					circularCrop: false,
				});
				if (base64Image) {
					methods.setValue("organizationStep.logo", base64Image);
				}
			}
		}
	};
	const handleRemoveLogo = (): void => {
		methods.setValue("organizationStep.logo", undefined, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};
	return (
		<div className={cn("flex w-full flex-col gap-4", className)} {...other}>
			<h1 className="text-xl font-semibold leading-none tracking-tight lg:text-2xl">
				Add your organization
			</h1>
			<p className="text-sm text-muted-foreground lg:text-base">
				We just need some basic info to get your organization set up. You’ll be
				able to edit this later.
			</p>
			<div className="space-y-2">
				<FormLabel>Logo</FormLabel>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<ImageDropzone
							accept={{ "image/*": [] }}
							onDrop={handleDrop}
							src={logo}
							borderRadius="xl"
							className="size-20 rounded-xl p-0.5"
						>
							<Avatar className="size-[72px] rounded-md">
								<AvatarFallback className="size-[72px] rounded-md text-2xl">
									<UploadIcon className="size-5 shrink-0 text-muted-foreground" />
								</AvatarFallback>
							</Avatar>
						</ImageDropzone>
						{!!logo && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="icon"
										className="absolute bottom-[-12px] right-[-12px] z-10 rounded-full bg-background p-1"
										onClick={handleRemoveLogo}
									>
										<TrashIcon className="size-4 shrink-0" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="right">Remove logo</TooltipContent>
							</Tooltip>
						)}
					</div>
					<div className="flex flex-col space-y-1">
						<span className="text-sm">Upload your logo</span>
						<span className="text-xs text-muted-foreground">
							*.png, *.jpeg files up to 5 MB
						</span>
					</div>
				</div>
			</div>
			<FormField
				control={methods.control}
				name="organizationStep.name"
				render={({ field }) => (
					<FormItem className="flex w-full flex-col">
						<FormLabel required>Name</FormLabel>
						<FormControl>
							<Input
								type="text"
								maxLength={64}
								required
								disabled={methods.formState.isSubmitting}
								{...field}
								onChange={(e) => {
									if (e.target.value && slug === slugify(field.value ?? "")) {
										methods.setValue(
											"organizationStep.slug",
											slugify(e.target.value ?? ""),
										);
									}
									field.onChange(e);
								}}
							/>
						</FormControl>
						{(methods.formState.touchedFields.organizationStep?.name ||
							methods.formState.submitCount > 0) && <FormMessage />}
					</FormItem>
				)}
			/>
			<FormField
				control={methods.control}
				name="organizationStep.slug"
				render={({ field }) => (
					<FormItem className="flex w-full flex-col">
						<FormLabel required>Slug</FormLabel>
						<FormControl>
							<Input
								type="text"
								maxLength={255}
								required
								disabled={methods.formState.isSubmitting}
								{...field}
								// onChange={handleSlugChange}
							/>
						</FormControl>
						<FormDescription className="break-all">
							{getPathname(
								routes.dashboard.organizations.Index,
								baseUrl.Dashboard,
							)}
							/{slug}
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<NextButton
				loading={loading}
				disabled={!canNext}
				isLastStep={isLastStep}
				onClick={async () => {
					const result = await checkIfSlugIsAvailable({ slug });
					if (!result?.data?.isAvailable) {
						methods.setError("organizationStep.slug", {
							type: "validate",
							message: "This slug is already taken.",
						});
						return;
					}
					handleNext();
				}}
			/>
		</div>
	);
}
