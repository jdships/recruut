"use server";

// Billing customer updates are handled automatically by Polar
import { db, eq } from "@workspace/database/client";
import { organizationTable } from "@workspace/database/schema";
import { revalidateTag } from "next/cache";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey, UserCacheKey } from "~/data/caching";
import { updateOrganizationDetailsSchema } from "~/schemas/organization/update-organization-details-schema";

export const updateOrganizationDetails = authOrganizationActionClient
	.metadata({ actionName: "updateOrganizationDetails" })
	.inputSchema(updateOrganizationDetailsSchema)
	.action(async ({ parsedInput, ctx }) => {
		await db
			.update(organizationTable)
			.set({
				name: parsedInput.name,
				address: parsedInput.address ? parsedInput.address : null,
				phone: parsedInput.phone ? parsedInput.phone : null,
				email: parsedInput.email ? parsedInput.email : null,
				website: parsedInput.website ? parsedInput.website : null,
			})
			.where(eq(organizationTable.id, ctx.organization.id));

		// Billing customer updates are handled automatically by Polar

		for (const membership of ctx.organization.memberships) {
			revalidateTag(
				Caching.createUserTag(UserCacheKey.Organizations, membership.userId),
			);
		}

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.OrganizationDetails,
				ctx.organization.id,
			),
		);
	});
