"use server";

import { isOrganizationAdmin } from "@workspace/auth/permissions";
// Seat adjustments are handled automatically by Polar webhooks
import { ForbiddenError, NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import {
	membershipTable,
	userTable,
	verificationTokenTable,
} from "@workspace/database/schema";
import { routes } from "@workspace/routes";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey, UserCacheKey } from "~/data/caching";
import { removeMemberSchema } from "~/schemas/members/remove-member-schema";

export const removeMember = authOrganizationActionClient
	.metadata({ actionName: "removeMember" })
	.inputSchema(removeMemberSchema)
	.action(async ({ parsedInput, ctx }) => {
		const isLeaving = ctx.session.user.id === parsedInput.id;
		if (!isLeaving) {
			const currentUserIsAdmin = await isOrganizationAdmin(
				ctx.session.user.id,
				ctx.organization.id,
			);
			if (!currentUserIsAdmin) {
				throw new ForbiddenError("Insufficient permissions");
			}
		}

		const [membership] = await db
			.select({
				id: membershipTable.id,
				role: membershipTable.role,
				isOwner: membershipTable.isOwner,
				user: {
					email: userTable.email,
				},
			})
			.from(membershipTable)
			.innerJoin(userTable, eq(membershipTable.userId, userTable.id))
			.where(
				and(
					eq(membershipTable.organizationId, ctx.organization.id),
					eq(membershipTable.userId, parsedInput.id),
				),
			)
			.limit(1);

		if (!membership) {
			throw new NotFoundError("Membership not found");
		}
		if (membership.isOwner) {
			throw new ForbiddenError("Owners cannot be removed.");
		}

		await db.transaction(async (tx) => {
			await tx
				.delete(verificationTokenTable)
				.where(eq(verificationTokenTable.identifier, membership.user.email!));

			await tx
				.delete(membershipTable)
				.where(eq(membershipTable.id, membership.id));
		});

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Members,
				ctx.organization.id,
			),
		);

		revalidateTag(Caching.createUserTag(UserCacheKey.Profile, parsedInput.id));
		revalidateTag(
			Caching.createUserTag(UserCacheKey.Organizations, parsedInput.id),
		);

		// Seat adjustments are handled automatically by Polar webhooks

		if (isLeaving) {
			redirect(routes.dashboard.organizations.Index);
		}
	});
