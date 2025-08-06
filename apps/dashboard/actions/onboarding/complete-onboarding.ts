"use server";

import {
	checkIfCanInvite,
	createInvitation,
	sendInvitationRequest,
} from "@workspace/auth/invitations";
import { decodeBase64Image, resizeImage } from "@workspace/common/image";
import type { Maybe } from "@workspace/common/maybe";
import { and, db, eq, type TransactionType } from "@workspace/database/client";
import {
	DayOfWeek,
	InvitationStatus,
	invitationTable,
	membershipTable,
	organizationLogoTable,
	organizationTable,
	Role,
	userImageTable,
	userTable,
	workHoursTable,
	workTimeSlotTable,
} from "@workspace/database/schema";
import {
	getOrganizationLogoUrl,
	getUserImageUrl,
	replaceOrgSlug,
	routes,
} from "@workspace/routes";
import { createHash } from "crypto";
import { revalidateTag } from "next/cache";
import { v4 } from "uuid";

import { authActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey, UserCacheKey } from "~/data/caching";
import { FileUploadAction } from "~/lib/file-upload";
import { getTimeSlot } from "~/lib/formatters";
import {
	type CompleteOnboardingSchema,
	completeOnboardingSchema,
	OnboardingStep,
} from "~/schemas/onboarding/complete-onboarding-schema";

export const completeOnboarding = authActionClient
	.metadata({ actionName: "completeOnboarding" })
	.inputSchema(completeOnboardingSchema)
	.action(async ({ parsedInput, ctx }) => {
		const organizationId = v4();
		const userId = ctx.session.user.id;
		const userEmail = ctx.session.user.email.toLowerCase();

		await db.transaction(async (tx) => {
			// Handle profile step
			if (parsedInput.activeSteps.includes(OnboardingStep.Profile)) {
				await handleProfileStep(parsedInput.profileStep, userId, tx);
			}

			// Handle theme step
			// No action required for theme step

			// Handle organization step
			if (parsedInput.activeSteps.includes(OnboardingStep.Organization)) {
				await handleOrganizationStep(
					parsedInput.organizationStep,
					organizationId,
					userEmail,
					userId,
					tx,
				);
			}

			// Handle pending invitations step
			if (parsedInput.activeSteps.includes(OnboardingStep.PendingInvitations)) {
				await handlePendingInvitationsStep(
					parsedInput.pendingInvitationsStep,
					userId,
					userEmail,
					tx,
				);
			}
		});

		revalidateTag(Caching.createUserTag(UserCacheKey.PersonalDetails, userId));
		revalidateTag(Caching.createUserTag(UserCacheKey.Preferences, userId));
		revalidateTag(Caching.createUserTag(UserCacheKey.Organizations, userId));

		// Ideally we would execute these in a background job
		if (
			parsedInput.activeSteps.includes(OnboardingStep.Organization) &&
			parsedInput.organizationStep
		) {
			// Handle invite team step
			if (parsedInput.activeSteps.includes(OnboardingStep.InviteTeam)) {
				await handleInviteTeamStep(
					parsedInput.inviteTeamStep,
					organizationId,
					parsedInput.organizationStep.name,
					ctx.session.user.name,
					ctx.session.user.email,
				);
			}
		}

		const memberships = await db
			.select({
				organization: {
					id: organizationTable.id,
					slug: organizationTable.slug,
				},
			})
			.from(membershipTable)
			.innerJoin(
				organizationTable,
				eq(membershipTable.organizationId, organizationTable.id),
			)
			.where(eq(membershipTable.userId, ctx.session.user.id));

		for (const membership of memberships) {
			// Seat adjustments are handled automatically by Polar webhooks

			revalidateTag(
				Caching.createOrganizationTag(
					OrganizationCacheKey.Members,
					membership.organization.id,
				),
			);
			revalidateTag(
				Caching.createOrganizationTag(
					OrganizationCacheKey.Invitations,
					membership.organization.id,
				),
			);
		}

		let redirect: string = routes.dashboard.organizations.Index;

		// Newly created organization
		if (
			parsedInput.activeSteps.includes(OnboardingStep.Organization) &&
			parsedInput.organizationStep?.slug
		) {
			redirect = replaceOrgSlug(
				routes.dashboard.organizations.slug.Home,
				parsedInput.organizationStep.slug,
			);
		}
		// Has only one organization
		else if (memberships.length === 1) {
			redirect = replaceOrgSlug(
				routes.dashboard.organizations.slug.Home,
				memberships[0].organization.slug,
			);
		}

		return { redirect };
	});

async function handleProfileStep(
	step: CompleteOnboardingSchema["profileStep"],
	userId: string,
	tx: TransactionType,
) {
	if (!step) {
		return;
	}

	let imageUrl: Maybe<string>;
	if (step.action === FileUploadAction.Update && step.image) {
		const { buffer, mimeType } = decodeBase64Image(step.image);
		const data = await resizeImage(buffer, mimeType);
		const hash = createHash("sha256").update(data).digest("hex");

		await tx.delete(userImageTable).where(eq(userImageTable.userId, userId));
		await tx.insert(userImageTable).values({
			userId,
			data,
			contentType: mimeType,
			hash,
		});

		imageUrl = getUserImageUrl(userId, hash);
	}
	if (step.action === FileUploadAction.Delete) {
		await tx.delete(userImageTable).where(eq(userImageTable.userId, userId));
		imageUrl = null;
	}
	await tx
		.update(userTable)
		.set({
			image: imageUrl,
			name: step.name,
			phone: step.phone ? step.phone : null,
			completedOnboarding: true,
		})
		.where(eq(userTable.id, userId));
}

async function handleOrganizationStep(
	step: CompleteOnboardingSchema["organizationStep"],
	organizationId: string,
	userEmail: string,
	userId: string,
	tx: TransactionType,
) {
	if (!step) {
		return;
	}

	// Billing customers are created automatically by Polar during checkout
	const billingCustomerId: string | undefined = undefined;

	await tx.insert(organizationTable).values({
		id: organizationId,
		logo: null,
		name: step.name,
		billingCustomerId,
		billingEmail: billingCustomerId ? userEmail : undefined,
		slug: step.slug,
		phone: null,
		address: null,
		email: null,
		website: null,
		facebookPage: null,
		instagramProfile: null,
		linkedInProfile: null,
		tikTokProfile: null,
		xProfile: null,
		youTubeChannel: null,
	});

	let logoUrl: Maybe<string>;
	if (step.logo) {
		const { buffer, mimeType } = decodeBase64Image(step.logo);
		const data = await resizeImage(buffer, mimeType);
		const hash = createHash("sha256").update(data).digest("hex");

		await tx.insert(organizationLogoTable).values({
			organizationId,
			data,
			contentType: mimeType,
			hash,
		});

		logoUrl = getOrganizationLogoUrl(organizationId, hash);

		await tx
			.update(organizationTable)
			.set({ logo: logoUrl })
			.where(eq(organizationTable.id, organizationId));
	}

	await tx.insert(membershipTable).values({
		userId,
		organizationId,
		role: Role.ADMIN,
		isOwner: true,
	});

	await createDefaultBusinessHours(organizationId, tx);
}

async function handlePendingInvitationsStep(
	step: CompleteOnboardingSchema["pendingInvitationsStep"],
	userId: string,
	userEmail: string,
	tx: TransactionType,
): Promise<void> {
	if (!step || !step.invitationIds) {
		return;
	}

	for (const invitationId of step.invitationIds) {
		const [pendingInvitation] = await tx
			.select({
				organizationId: invitationTable.organizationId,
				role: invitationTable.role,
			})
			.from(invitationTable)
			.where(
				and(
					eq(invitationTable.id, invitationId),
					eq(invitationTable.email, userEmail),
					eq(invitationTable.status, InvitationStatus.PENDING),
				),
			)
			.limit(1);

		if (!pendingInvitation) {
			continue;
		}

		await tx.insert(membershipTable).values({
			userId,
			organizationId: pendingInvitation.organizationId,
			role: pendingInvitation.role,
		});

		await tx
			.update(invitationTable)
			.set({ status: InvitationStatus.ACCEPTED })
			.where(eq(invitationTable.id, invitationId));
	}
}

async function handleInviteTeamStep(
	step: CompleteOnboardingSchema["inviteTeamStep"],
	organizationId: string,
	organizationName: string,
	userName: string,
	userEmail: string,
): Promise<void> {
	if (!step || !step.invitations) {
		return;
	}

	// Note: During onboarding, we allow team invitations regardless of plan
	// The user can set up their team, but the invitations will be restricted
	// by plan limits after onboarding is complete. This provides a better UX.

	for (const invitationItem of step.invitations) {
		if (!invitationItem.email) {
			continue;
		}

		const canInvite = await checkIfCanInvite(
			invitationItem.email,
			organizationId,
		);
		if (!canInvite) {
			continue;
		}

		try {
			const newInvitation = await createInvitation(
				invitationItem.email,
				invitationItem.role,
				organizationId,
			);
			await sendInvitationRequest({
				email: newInvitation.email,
				organizationName,
				invitedByEmail: userEmail,
				invitedByName: userName,
				token: newInvitation.token,
				invitationId: newInvitation.id,
				organizationId,
			});
		} catch (e) {
			console.error(e);
		}
	}
}

async function createDefaultBusinessHours(
	organizationId: string,
	tx: TransactionType,
) {
	const timeSlot = { start: getTimeSlot(9, 0), end: getTimeSlot(17, 0) };

	const days = [
		DayOfWeek.SUNDAY,
		DayOfWeek.MONDAY,
		DayOfWeek.TUESDAY,
		DayOfWeek.WEDNESDAY,
		DayOfWeek.THURSDAY,
		DayOfWeek.FRIDAY,
		DayOfWeek.SATURDAY,
	];

	for (const day of days) {
		const newWorkHours = await tx
			.insert(workHoursTable)
			.values({
				organizationId,
				dayOfWeek: day,
			})
			.returning({ id: workHoursTable.id });

		if (day !== DayOfWeek.SUNDAY && day !== DayOfWeek.SATURDAY) {
			await tx.insert(workTimeSlotTable).values({
				workHoursId: newWorkHours[0].id,
				start: timeSlot.start,
				end: timeSlot.end,
			});
		}
	}
}
