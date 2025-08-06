"use server";

// Seat adjustments are handled automatically by Polar webhooks
import { NotFoundError, PreConditionError } from "@workspace/common/errors";
import { db, eq } from "@workspace/database/client";
import {
	InvitationStatus,
	invitationTable,
	membershipTable,
	organizationTable,
} from "@workspace/database/schema";
import { replaceOrgSlug, routes } from "@workspace/routes";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { authActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey, UserCacheKey } from "~/data/caching";
import { acceptInvitationSchema } from "~/schemas/invitations/accept-invitation-schema";

export const acceptInvitation = authActionClient
	.metadata({ actionName: "acceptInvitation" })
	.inputSchema(acceptInvitationSchema)
	.action(async ({ parsedInput, ctx }) => {
		const [invitation] = await db
			.select({
				status: invitationTable.status,
				email: invitationTable.email,
				role: invitationTable.role,
				organizationId: invitationTable.organizationId,
			})
			.from(invitationTable)
			.where(eq(invitationTable.id, parsedInput.invitationId))
			.limit(1);

		if (!invitation) {
			throw new NotFoundError("Invitation not found");
		}
		if (invitation.status === InvitationStatus.REVOKED) {
			throw new PreConditionError("Invitation was revoked");
		}
		if (invitation.status === InvitationStatus.ACCEPTED) {
			throw new PreConditionError("Invitation was already accepted");
		}
		const normalizedEmail = invitation.email.toLowerCase();
		if (normalizedEmail !== ctx.session.user.email) {
			throw new PreConditionError("Email does not match");
		}
		const [organization] = await db
			.select({
				slug: organizationTable.slug,
			})
			.from(organizationTable)
			.where(eq(organizationTable.id, invitation.organizationId))
			.limit(1);

		if (!organization) {
			throw new NotFoundError("Organization not found");
		}

		await db.transaction(async (tx) => {
			await tx
				.update(invitationTable)
				.set({ status: InvitationStatus.ACCEPTED })
				.where(eq(invitationTable.id, parsedInput.invitationId));

			await tx.insert(membershipTable).values({
				organizationId: invitation.organizationId,
				userId: ctx.session.user.id,
				role: invitation.role,
			});
		});

		// Seat adjustments are handled automatically by Polar webhooks

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Members,
				invitation.organizationId,
			),
		);
		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Invitations,
				invitation.organizationId,
			),
		);
		revalidateTag(
			Caching.createUserTag(UserCacheKey.Organizations, ctx.session.user.id),
		);

		return redirect(
			replaceOrgSlug(
				routes.dashboard.organizations.slug.Home,
				organization.slug,
			),
		);
	});
