"use server";

import { Index } from "@upstash/vector";
import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import { opportunityTable } from "@workspace/database/schema";
import { revalidateTag } from "next/cache";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { updateOpportunitySchema } from "~/schemas/opportunities/update-opportunity-schema";
import { Caching, OrganizationCacheKey } from "../../data/caching";

export const updateOpportunity = authOrganizationActionClient
	.metadata({ actionName: "updateOpportunity" })
	.inputSchema(updateOpportunitySchema)
	.action(async ({ parsedInput, ctx }) => {
		const [existingOpportunity] = await db
			.select({})
			.from(opportunityTable)
			.where(
				and(
					eq(opportunityTable.id, parsedInput.id),
					eq(opportunityTable.organizationId, ctx.organization.id),
				),
			)
			.limit(1);

		if (!existingOpportunity) {
			throw new NotFoundError("Opportunity not found");
		}

		// Update the opportunity in the database
		await db
			.update(opportunityTable)
			.set({
				title: parsedInput.title,
				description: parsedInput.description,
				positionLink: parsedInput.positionLink,
				documents: parsedInput.documents,
				hiringManagerEmail: parsedInput.hiringManagerEmail,
				moreContext: parsedInput.moreContext,
				updatedAt: new Date(),
			})
			.where(eq(opportunityTable.id, parsedInput.id));

		// Clean up old embeddings and create new ones
		try {
			const index = new Index(); // uses env vars

			// Query for all embeddings associated with this opportunity
			const results = await index.query({
				data: "", // Empty query to get all embeddings
				includeVectors: false,
				includeMetadata: true,
				topK: 1000, // Get a large number to find all embeddings
			});

			// Find and delete old embeddings
			const embeddingsToDelete = results
				.filter((result) => result.metadata?.opportunityId === parsedInput.id)
				.map((result) => String(result.id));

			// Delete the old embeddings
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

			// Create new embeddings
			const embeddings = [];

			// Embed the job title and description
			if (parsedInput.title) {
				embeddings.push({
					id: `${parsedInput.id}-title`,
					data: `Job Title: ${parsedInput.title}`,
					metadata: {
						opportunityId: parsedInput.id,
						type: "title",
						content: parsedInput.title,
					},
				});
			}

			// Embed the job description
			if (parsedInput.description) {
				embeddings.push({
					id: `${parsedInput.id}-description`,
					data: `Job Description: ${parsedInput.description}`,
					metadata: {
						opportunityId: parsedInput.id,
						type: "description",
						content: parsedInput.description,
					},
				});
			}

			// Embed additional context
			if (parsedInput.moreContext) {
				embeddings.push({
					id: `${parsedInput.id}-context`,
					data: `Additional Context: ${parsedInput.moreContext}`,
					metadata: {
						opportunityId: parsedInput.id,
						type: "context",
						content: parsedInput.moreContext,
					},
				});
			}

			// Embed uploaded documents
			if (parsedInput.documents && parsedInput.documents.length > 0) {
				parsedInput.documents.forEach((url: string, i: number) => {
					embeddings.push({
						id: `${parsedInput.id}-document-${i}`,
						data: url,
						metadata: {
							opportunityId: parsedInput.id,
							type: "document",
							url,
						},
					});
				});
			}

			// Upsert all new embeddings
			if (embeddings.length > 0) {
				await index.upsert(embeddings);
			}
		} catch (err) {
			// Log but do not block opportunity update
			console.error("Upstash embedding update error:", err);
		}

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Opportunities,
				ctx.organization.id,
			),
		);
	});
