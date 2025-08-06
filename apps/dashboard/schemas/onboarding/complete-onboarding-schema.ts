import { Role } from "@workspace/database/schema";
import { z } from "zod";

import { FileUploadAction } from "~/lib/file-upload";

export const profileOnboardingSchema = z.object({
	action: z.nativeEnum(FileUploadAction, {
		required_error: "Action is required",
		invalid_type_error: "Action must be a string",
	}),
	image: z
		.string({
			invalid_type_error: "Image must be a string.",
		})
		.optional()
		.or(z.literal("")),
	name: z
		.string({
			required_error: "Name is required.",
			invalid_type_error: "Name must be a string.",
		})
		.trim()
		.min(1, "Name is required.")
		.max(64, "Maximum 64 characters allowed."),
	phone: z
		.string({
			invalid_type_error: "Phone must be a string.",
		})
		.trim()
		.max(16, "Maximum 16 characters allowed.")
		.optional()
		.or(z.literal("")),
	// We are not using the email on the server
	email: z.string().optional().or(z.literal("")),
});

export const themeOnboardingSchema = z.object({
	theme: z.literal("light").or(z.literal("dark").or(z.literal("system"))),
});

export const organizationOnboardingSchema = z.object({
	logo: z
		.string({
			invalid_type_error: "Logo must be a string.",
		})
		.optional()
		.or(z.literal("")),
	name: z
		.string({
			required_error: "Name is required.",
			invalid_type_error: "Name must be a string.",
		})
		.trim()
		.min(1, "Name is required.")
		.max(64, "Maximum 64 characters allowed."),
	slug: z
		.string({
			required_error: "Slug is required.",
			invalid_type_error: "Slug must be a string.",
		})
		.trim()
		.min(3, "Minimum 3 characters required.")
		.max(1024, "Maximum 1024 characters allowed.")
		.regex(/^[a-z0-9]+[a-z0-9_-]*[a-z0-9]+$/, {
			message:
				"Slug must start and end with a letter or number and can contain underscores and hyphens in between.",
		}),
});

export const inviteTeamOnboardingSchema = z.object({
	invitations: z
		.array(
			z.object({
				email: z
					.string()
					.trim()
					.max(255, "Maximum 255 characters allowed.")
					.email("Enter a valid email address.")
					.optional()
					.or(z.literal("")),
				role: z.nativeEnum(Role, {
					required_error: "Role is required",
					invalid_type_error: "Role must be a string",
				}),
			}),
		)
		.max(5, "Maximum 5 invitations allowed.")
		.optional(),
});

export const pendingInvitationsOnboardingSchema = z.object({
	invitationIds: z.array(
		z
			.string({
				required_error: "Id is required.",
				invalid_type_error: "Id must be a string.",
			})
			.trim()
			.uuid("Id is invalid.")
			.min(1, "Id is required.")
			.max(36, "Maximum 36 characters allowed."),
	),
});

export enum OnboardingStep {
	Profile = "profile",
	Theme = "theme",
	Organization = "organization",
	InviteTeam = "invite-team",
	PendingInvitations = "pending-invitations",
}

export const completeOnboardingSchema = z.object({
	activeSteps: z.array(z.nativeEnum(OnboardingStep)),
	profileStep: profileOnboardingSchema.optional(),
	themeStep: themeOnboardingSchema.optional(),
	organizationStep: organizationOnboardingSchema.optional(),
	inviteTeamStep: inviteTeamOnboardingSchema.optional(),
	pendingInvitationsStep: pendingInvitationsOnboardingSchema.optional(),
});

export type CompleteOnboardingSchema = z.infer<typeof completeOnboardingSchema>;
