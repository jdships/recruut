import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { ValidationError } from "@workspace/common/errors";
import { and, db, desc, eq, gte, lte } from "@workspace/database/client";
import { applicationTable } from "@workspace/database/schema";
import { endOfDay, startOfDay } from "date-fns";
import { unstable_cache as cache } from "next/cache";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	OrganizationCacheKey,
} from "~/data/caching";
import {
	type GetTopCandidatesSchema,
	getTopCandidatesSchema,
} from "~/schemas/home/get-top-candidates-schema";
import type { TopCandidateDto } from "~/types/dtos/opportunity-dto";

export async function getTopCandidates(
	input: GetTopCandidatesSchema,
): Promise<TopCandidateDto[]> {
	const ctx = await getAuthOrganizationContext();

	const result = getTopCandidatesSchema.safeParse(input);
	if (!result.success) {
		throw new ValidationError(JSON.stringify(result.error.flatten()));
	}
	const parsedInput = result.data;

	return cache(
		async () => {
			const candidates = await db
				.select({
					id: applicationTable.id,
					name: applicationTable.name,
					email: applicationTable.email,
					aiScore: applicationTable.aiScore,
					image: applicationTable.image,
				})
				.from(applicationTable)
				.where(
					and(
						eq(applicationTable.organizationId, ctx.organization.id),
						gte(applicationTable.createdAt, startOfDay(parsedInput.from)),
						lte(applicationTable.createdAt, endOfDay(parsedInput.to)),
					),
				)
				.orderBy(desc(applicationTable.aiScore))
				.limit(6);

			const response: TopCandidateDto[] = (candidates as TopCandidateDto[]).map(
				(candidate) => ({
					id: candidate.id,
					name: candidate.name,
					email: candidate.email,
					aiScore: candidate.aiScore,
					image: candidate.image ?? undefined,
				}),
			);

			return response;
		},
		Caching.createOrganizationKeyParts(
			OrganizationCacheKey.Applications,
			ctx.organization.id,
			parsedInput.from.toISOString(),
			parsedInput.to.toISOString(),
		),
		{
			revalidate: defaultRevalidateTimeInSeconds,
			tags: [
				Caching.createOrganizationTag(
					OrganizationCacheKey.Applications,
					ctx.organization.id,
				),
			],
		},
	)();
}
