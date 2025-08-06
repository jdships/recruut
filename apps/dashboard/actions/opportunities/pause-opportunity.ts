"use server";

import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import { opportunityTable } from "@workspace/database/schema";
import { revalidateTag } from "next/cache";
import { authOrganizationActionClient } from "~/actions/safe-action";
import { pauseOpportunitySchema } from "~/schemas/opportunities/pause-opportunity-schema";
import { Caching, OrganizationCacheKey } from "../../data/caching";

export const pauseOpportunity = authOrganizationActionClient
	.metadata({ actionName: "pauseOpportunity" })
	.inputSchema(pauseOpportunitySchema)
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

		// Update the opportunity status to paused
		await db
			.update(opportunityTable)
			.set({ status: "paused" })
			.where(eq(opportunityTable.id, parsedInput.id));

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Opportunities,
				ctx.organization.id,
			),
		);
	});
