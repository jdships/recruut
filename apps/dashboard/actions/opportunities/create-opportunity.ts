"use server";

import { Index } from "@upstash/vector";
import { Caching, OrganizationCacheKey } from "@workspace/common/caching";
import { db } from "@workspace/database/client";
import { opportunityTable } from "@workspace/database/schema";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";
import type { z } from "zod";
import { getOpportunityLimits } from "~/data/opportunities/get-opportunity-limits";
import { createOpportunitySchema } from "~/schemas/opportunities/create-opportunity-schema";

export async function createOpportunity({
	organizationId,
	userId,
	input,
}: {
	organizationId: string;
	userId: string;
	input: z.infer<typeof createOpportunitySchema>;
}) {
	const parsed = createOpportunitySchema.safeParse(input);
	if (!parsed.success) {
		return {
			serverError: null,
			validationErrors: parsed.error.flatten().fieldErrors,
		};
	}

	// Check if user can create more opportunities
	const limitsData = await getOpportunityLimits();
	if (!limitsData.canCreate) {
		return {
			serverError: `You've reached your plan limit of ${limitsData.opportunityLimit} opportunities. Upgrade to create more.`,
			validationErrors: null,
		};
	}

	const {
		title,
		description,
		positionLink,
		documents,
		hiringManagerEmail,
		moreContext,
	} = parsed.data;
	const opportunityId = randomUUID();

	await db.insert(opportunityTable).values({
		id: opportunityId,
		organizationId,
		createdBy: userId,
		title,
		description,
		positionLink,
		documents: documents ?? [],
		hiringManagerEmail,
		moreContext,
	});

	revalidateTag(
		Caching.createOrganizationTag(
			OrganizationCacheKey.Opportunities,
			organizationId,
		),
	);
	revalidateTag(
		Caching.createOrganizationTag(
			OrganizationCacheKey.PlanUsage,
			organizationId,
		),
	);

	// Create embeddings for the job opportunity
	try {
		const index = new Index(); // uses env vars
		const embeddings = [];

		// Embed the job title and description
		if (title) {
			embeddings.push({
				id: `${opportunityId}-title`,
				data: `Job Title: ${title}`,
				metadata: {
					opportunityId,
					type: "title",
					content: title,
				},
			});
		}

		// Embed the job description
		if (description) {
			embeddings.push({
				id: `${opportunityId}-description`,
				data: `Job Description: ${description}`,
				metadata: {
					opportunityId,
					type: "description",
					content: description,
				},
			});
		}

		// Embed additional context
		if (moreContext) {
			embeddings.push({
				id: `${opportunityId}-context`,
				data: `Additional Context: ${moreContext}`,
				metadata: {
					opportunityId,
					type: "context",
					content: moreContext,
				},
			});
		}

		// Embed uploaded documents
		if (documents && documents.length > 0) {
			documents.forEach((url: string, i: number) => {
				embeddings.push({
					id: `${opportunityId}-document-${i}`,
					data: url,
					metadata: {
						opportunityId,
						type: "document",
						url,
					},
				});
			});
		}

		// Upsert all embeddings
		if (embeddings.length > 0) {
			await index.upsert(embeddings);
		}
	} catch (err) {
		// Log but do not block opportunity creation
		console.error("Upstash embedding error:", err);
	}

	return { serverError: null, validationErrors: null, data: { opportunityId } };
}
