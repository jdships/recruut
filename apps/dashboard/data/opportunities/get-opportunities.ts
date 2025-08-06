import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { db, desc, eq, sql } from "@workspace/database/client";
import { applicationTable, opportunityTable } from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";
import { Caching, OrganizationCacheKey } from "../caching";

export async function getOpportunities() {
	const ctx = await getAuthOrganizationContext();

	return cache(
		async () => {
			const opportunities = await db
				.select()
				.from(opportunityTable)
				.where(eq(opportunityTable.organizationId, ctx.organization.id))
				.orderBy(desc(opportunityTable.createdAt));
			return opportunities;
		},
		Caching.createOrganizationKeyParts(
			OrganizationCacheKey.Opportunities,
			ctx.organization.id,
		),
		{
			tags: [
				Caching.createOrganizationTag(
					OrganizationCacheKey.Opportunities,
					ctx.organization.id,
				),
			],
			revalidate: 60,
		},
	)();
}

export async function getOpportunitiesWithSubmissions() {
	const ctx = await getAuthOrganizationContext();
	// Fetch opportunities with submission count and up to 3 avatars and names
	const rows = await db
		.select({
			id: opportunityTable.id,
			title: opportunityTable.title,
			description: opportunityTable.description,
			status: opportunityTable.status,
			createdAt: opportunityTable.createdAt,
		})
		.from(opportunityTable)
		.where(eq(opportunityTable.organizationId, ctx.organization.id));

	// For each opportunity, fetch up to 3 avatars and first names, and submission count
	const result = await Promise.all(
		rows.map(async (opp) => {
			const applicants = await db
				.select({ image: applicationTable.image, name: applicationTable.name })
				.from(applicationTable)
				.where(eq(applicationTable.opportunityId, opp.id))
				.limit(3);
			const submissionCountResult = await db
				.select({ count: sql<number>`COUNT(*)` })
				.from(applicationTable)
				.where(eq(applicationTable.opportunityId, opp.id));
			const submissionCount = submissionCountResult[0]?.count ?? 0;
			return {
				...opp,
				avatars: applicants.map((a) => a.image).filter(Boolean),
				avatarNames: applicants.map((a) => a.name.split(" ")[0]),
				submissionCount: submissionCount,
			};
		}),
	);
	return result;
}
