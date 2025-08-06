"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Card, type CardProps } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { EmojiPopover } from "@workspace/ui/components/emoji-popover";
import {
	FormControl,
	FormField,
	FormItem,
	FormProvider,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";
import type { SubmitHandler } from "react-hook-form";

import { addApplicationComment } from "~/actions/applications/add-application-comment";
import { useZodForm } from "~/hooks/use-zod-form";
import { getInitials } from "~/lib/formatters";
import {
	type AddApplicationCommentSchema,
	addApplicationCommentSchema,
} from "~/schemas/applications/add-application-comment-schema";
import type { ApplicationDto } from "~/types/dtos/application-dto";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export type ApplicationTimelineAddCommentCardProps = CardProps & {
	profile: ProfileDto;
	application: ApplicationDto;
	showComments: boolean;
	onShowCommentsChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ApplicationTimelineAddComment({
	profile,
	application,
	className,
	showComments,
	onShowCommentsChange,
	...other
}: ApplicationTimelineAddCommentCardProps): React.JSX.Element {
	const methods = useZodForm({
		schema: addApplicationCommentSchema,
		mode: "all",
		defaultValues: {
			applicationId: application.id,
			text: "",
		},
	});
	const canSubmit =
		!methods.formState.isSubmitting && methods.formState.isValid;
	const handleEmojiSelected = (emoji: string) => {
		methods.setValue("text", methods.getValues("text") + emoji, {
			shouldValidate: true,
		});
	};
	const onSubmit: SubmitHandler<AddApplicationCommentSchema> = async (
		values,
	): Promise<void> => {
		if (!canSubmit) {
			return;
		}
		const result = await addApplicationComment({
			applicationId: values.applicationId,
			text: values.text,
		});
		if (!result?.serverError && !result?.validationErrors) {
			methods.reset(methods.formState.defaultValues);
		} else {
			toast.error("Couldn't add comment");
		}
	};
	return (
		<>
			<Avatar
				title={profile.name}
				className="relative ml-0.5 mt-3 size-6 flex-none rounded-full"
			>
				<AvatarImage src={profile.image} alt="avatar" />
				<AvatarFallback className="size-6 text-[10px]">
					{getInitials(profile.name)}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-auto flex-col gap-2">
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Card className={cn("rounded-lg p-0 gap-0", className)} {...other}>
							<input
								type="hidden"
								className="hidden"
								{...methods.register("applicationId")}
							/>
							<FormField
								control={methods.control}
								name="text"
								render={({ field }) => (
									<FormItem className="flex w-full items-center px-4 py-2">
										<FormControl>
											<Input
												type="text"
												className="w-full flex-1 border-0 shadow-none outline-0"
												placeholder="Leave a comment... You can use @mentions to tag team members."
												maxLength={2000}
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Separator />
							<div className="flex items-center justify-between px-3 py-1 text-muted-foreground">
								<div className="flex flex-row gap-2">
									<EmojiPopover onEmojiSelected={handleEmojiSelected} />
								</div>
								<Button
									type="submit"
									variant="default"
									size="sm"
									disabled={!canSubmit}
								>
									Post
								</Button>
							</div>
						</Card>
					</form>
				</FormProvider>
				<div className="flex items-center justify-end">
					<div className="flex flex-row items-center gap-1.5 p-1">
						<Checkbox
							id="show-comment"
							checked={showComments}
							onCheckedChange={() => onShowCommentsChange((prev) => !prev)}
						/>
						<Label htmlFor="show-comment" className="cursor-pointer text-xs">
							Show comments
						</Label>
					</div>
				</div>
			</div>
		</>
	);
}
