"use client";

import NiceModal, { type NiceModalHocProps } from "@ebay/nice-modal-react";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormProvider,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { toast } from "@workspace/ui/components/sonner";
import * as React from "react";
import { createOpportunity } from "~/actions/opportunities/create-opportunity";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import { useZodForm } from "~/hooks/use-zod-form";
import { createOpportunitySchema } from "~/schemas/opportunities/create-opportunity-schema";
import { VercelBlobUpload } from "./file-upload-vercel-blob";

// Add the proper type
type CreateOpportunityInput = typeof createOpportunitySchema._type;

export type CreateOpportunityModalProps = NiceModalHocProps & {
	user: { id: string; name?: string; email?: string };
};

export const CreateOpportunityModal =
	NiceModal.create<CreateOpportunityModalProps>(({ user }) => {
		const modal = NiceModal.useModal();
		const activeOrganization = useActiveOrganization();
		const organizationId = activeOrganization?.id;
		const userId = user.id;
		const methods = useZodForm({
			schema: createOpportunitySchema,
			defaultValues: {
				title: "",
				description: "",
				positionLink: "",
				documents: [],
				hiringManagerEmail: user.email, // Set from user context
				moreContext: "",
			},
			mode: "onSubmit",
		});
		const [loading, setLoading] = React.useState(false);
		const [serverError, setServerError] = React.useState<string | null>(null);
		const [opportunityId, setOpportunityId] = React.useState<string | null>(
			null,
		);
		const [showUrl, setShowUrl] = React.useState(false);
		const [_copied, _setCopied] = React.useState(false);

		const applicationUrl = opportunityId
			? `${process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:3002"}/${opportunityId}`
			: "";

		const _copyToClipboard = async () => {
			try {
				await navigator.clipboard.writeText(applicationUrl);
				_setCopied(true);
				toast.success("Application URL copied to clipboard!");
				setTimeout(() => _setCopied(false), 2000);
			} catch (_error) {
				toast.error("Failed to copy URL");
			}
		};

		const resetModal = () => {
			setOpportunityId(null);
			setShowUrl(false);
			_setCopied(false);
			methods.reset();
		};
		const onSubmit = async (values: CreateOpportunityInput) => {
			setLoading(true);
			setServerError(null);
			// Automatically set hiringManagerEmail to the current user's email
			const result = await createOpportunity({
				organizationId,
				userId,
				input: {
					...values,
					hiringManagerEmail: user.email || values.hiringManagerEmail, // override with user email if available
				},
			});
			setLoading(false);
			if (result?.serverError) {
				setServerError(result.serverError);
			} else if (!result?.validationErrors && result?.data?.opportunityId) {
				setOpportunityId(result.data.opportunityId);
				setShowUrl(true);
				toast.success("Opportunity created successfully!");
				methods.reset(); // Clear form fields after successful creation
			}
		};

		// Add debugging for form submission
		const handleFormSubmit = (e: React.FormEvent) => {
			// Check if form is valid
			if (
				!methods.formState.isValid &&
				Object.keys(methods.formState.errors).length > 0
			) {
				return;
			}

			// Call the original handleSubmit
			methods.handleSubmit(onSubmit)(e);
		};
		return (
			<FormProvider {...methods}>
				<Dialog
					open={modal.visible}
					onOpenChange={(open) => {
						if (!open) modal.hide();
					}}
				>
					<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
						<DialogHeader className="px-2 mb-2">
							<DialogTitle className="text-lg font-semibold">
								{showUrl
									? "Opportunity Created Successfully!"
									: "Create a new opportunity"}
							</DialogTitle>
							<DialogDescription className="text-sm text-muted-foreground">
								{showUrl
									? "Share this unique URL with applicants to apply for this opportunity."
									: "Fill out the details below to create a new opportunity."}
							</DialogDescription>
						</DialogHeader>
						<form
							id="create-opportunity-form"
							onSubmit={handleFormSubmit}
							className="flex flex-col flex-1 overflow-hidden"
						>
							<div className="flex-1 overflow-y-auto space-y-6 px-2">
								{/* Title */}
								<FormField
									control={methods.control}
									name="title"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel required>Opportunity Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="e.g. Senior Frontend Engineer"
													disabled={loading}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Description */}
								<FormField
									control={methods.control}
									name="description"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Short opportunity description"
													disabled={loading}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Position Link */}
								<FormField
									control={methods.control}
									name="positionLink"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel required>Position Link</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="https://company.com/careers/position"
													type="url"
													disabled={loading}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={methods.control}
									name="moreContext"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel>More Context</FormLabel>
											<FormControl>
												<textarea
													{...field}
													placeholder="Any extra info about the role, company, or expectations."
													className="min-h-[100px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													disabled={loading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Documents (Vercel Blob Upload) */}
								<FormField
									control={methods.control}
									name="documents"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel>Documents</FormLabel>
											<FormControl>
												<VercelBlobUpload onValueChange={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{serverError && (
									<div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
										<p className="text-sm text-destructive">{serverError}</p>
									</div>
								)}
							</div>

							<DialogFooter className="flex flex-row justify-between items-center pt-6 px-2">
								{showUrl ? (
									<>
										<Button
											variant="outline"
											type="button"
											onClick={() => {
												resetModal();
												modal.hide();
											}}
										>
											Close
										</Button>
										<Button
											type="button"
											onClick={() => {
												resetModal();
												modal.hide();
											}}
										>
											Create Another Opportunity
										</Button>
									</>
								) : (
									<>
										<Button
											variant="outline"
											type="button"
											disabled={loading}
											onClick={() => modal.hide()}
										>
											Cancel
										</Button>
										<Button type="submit" loading={loading} disabled={loading}>
											Create Opportunity
										</Button>
									</>
								)}
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</FormProvider>
		);
	});
