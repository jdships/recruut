"use server";

import { Index } from "@upstash/vector";
import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import { opportunityTable } from "@workspace/database/schema";
import { revalidateTag } from "next/cache";
import { authOrganizationActionClient } from "~/actions/safe-action";
import { deleteOpportunitySchema } from "~/schemas/opportunities/delete-opportunity-schema";
import { Caching, OrganizationCacheKey } from "../../data/caching";

export const deleteOpportunity = authOrganizationActionClient
	.metadata({ actionName: "deleteOpportunity" })
	.inputSchema(deleteOpportunitySchema)
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

		// Delete the opportunity from the database
		await db
			.delete(opportunityTable)
			.where(eq(opportunityTable.id, parsedInput.id));

		// Clean up embeddings from Upstash Vector
		try {
			const index = new Index(); // uses env vars

			// Query for all embeddings associated with this opportunity
			const results = await index.query({
				data: "", // Empty query to get all embeddings
				includeVectors: false,
				includeMetadata: true,
				topK: 1000, // Get a large number to find all embeddings
			});

			// Find embeddings that belong to this opportunity
			const embeddingsToDelete = results
				.filter((result) => result.metadata?.opportunityId === parsedInput.id)
				.map((result) => String(result.id));

			// Delete the embeddings one by one since Upstash Vector doesn't support bulk delete
			for (const embeddingId of embeddingsToDelete) {
				try {
					await index.delete([embeddingId]);
				} catch (deleteErr) {
					console.error(
						`Failed to delete embedding ${embeddingId}:`,
						deleteErr,
					);
				}
			}

			if (embeddingsToDelete.length > 0) {
				console.log(
					`Deleted ${embeddingsToDelete.length} embeddings for opportunity ${parsedInput.id}`,
				);
			}
		} catch (err) {
			// Log but do not block opportunity deletion
			console.error("Upstash embedding deletion error:", err);
		}

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Opportunities,
				ctx.organization.id,
			),
		);
	});
