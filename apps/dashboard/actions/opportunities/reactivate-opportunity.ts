"use server";

import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import { opportunityTable } from "@workspace/database/schema";
import { revalidateTag } from "next/cache";
import { authOrganizationActionClient } from "~/actions/safe-action";
import { reactivateOpportunitySchema } from "~/schemas/opportunities/reactivate-opportunity-schema";
import { Caching, OrganizationCacheKey } from "../../data/caching";

export const reactivateOpportunity = authOrganizationActionClient
	.metadata({ actionName: "reactivateOpportunity" })
	.inputSchema(reactivateOpportunitySchema)
	.action(async ({ parsedInput, ctx }) => {
		const [opportunity] = await db
			.select({})
			.from(opportunityTable)
			.where(
				and(
					eq(opportunityTable.id, parsedInput.id),
					eq(opportunityTable.organizationId, ctx.organization.id),
				),
			)
			.limit(1);

		if (!opportunity) {
			throw new NotFoundError("Opportunity not found");
		}

		await db
			.update(opportunityTable)
			.set({ status: "active" })
			.where(eq(opportunityTable.id, parsedInput.id));

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Opportunities,
				ctx.organization.id,
			),
		);

		return { success: true };
	});
