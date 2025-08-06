import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { ValidationError } from "@workspace/common/errors";
import { and, count, db, desc, eq, gte, lte } from "@workspace/database/client";
import { applicationTable, opportunityTable } from "@workspace/database/schema";
import { endOfDay, startOfDay } from "date-fns";
import { unstable_cache as cache } from "next/cache";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	OrganizationCacheKey,
} from "~/data/caching";
import {
	type GetTopOpportunitiesSchema,
	getTopOpportunitiesSchema,
} from "~/schemas/home/get-top-opportunities-schema";
import type { TopOpportunityDto } from "~/types/dtos/opportunity-dto";

export async function getTopOpportunities(
	input: GetTopOpportunitiesSchema,
): Promise<TopOpportunityDto[]> {
	const ctx = await getAuthOrganizationContext();

	const result = getTopOpportunitiesSchema.safeParse(input);
	if (!result.success) {
		throw new ValidationError(JSON.stringify(result.error.flatten()));
	}
	const parsedInput = result.data;

	return cache(
		async () => {
			const submissionCount = count(applicationTable.id).as("submissionCount");

			const opportunities = await db
				.select({
					id: opportunityTable.id,
					title: opportunityTable.title,
					description: opportunityTable.description,
					submissionCount,
				})
				.from(opportunityTable)
				.leftJoin(
					applicationTable,
					and(
						eq(applicationTable.opportunityId, opportunityTable.id),
						gte(applicationTable.createdAt, startOfDay(parsedInput.from)),
						lte(applicationTable.createdAt, endOfDay(parsedInput.to)),
					),
				)
				.where(eq(opportunityTable.organizationId, ctx.organization.id))
				.groupBy(
					opportunityTable.id,
					opportunityTable.title,
					opportunityTable.description,
				)
				.orderBy(desc(submissionCount))
				.limit(6);

			const response: TopOpportunityDto[] = opportunities.map(
				(opportunity) => ({
					id: opportunity.id,
					title: opportunity.title,
					description: opportunity.description ?? undefined,
					submissionCount: Number(opportunity.submissionCount),
				}),
			);

			return response;
		},
		Caching.createOrganizationKeyParts(
			OrganizationCacheKey.Opportunities,
			ctx.organization.id,
			parsedInput.from.toISOString(),
			parsedInput.to.toISOString(),
		),
		{
			revalidate: defaultRevalidateTimeInSeconds,
			tags: [
				Caching.createOrganizationTag(
					OrganizationCacheKey.Opportunities,
					ctx.organization.id,
				),
			],
		},
	)();
}
