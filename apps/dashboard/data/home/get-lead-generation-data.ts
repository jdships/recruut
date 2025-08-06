import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { ValidationError } from "@workspace/common/errors";
import { db, sql } from "@workspace/database/client";
import { applicationTable } from "@workspace/database/schema";
import { endOfDay, format, startOfDay } from "date-fns";
import { unstable_cache as cache } from "next/cache";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	OrganizationCacheKey,
} from "~/data/caching";
import {
	type GetLeadGenerationDataSchema,
	getLeadGenerationDataSchema,
} from "~/schemas/home/get-lead-generation-data-schema";
import type { LeadGenerationDataPointDto } from "~/types/dtos/lead-generation-data-point-dto";

export async function getLeadGenerationData(
	input: GetLeadGenerationDataSchema,
): Promise<LeadGenerationDataPointDto[]> {
	const ctx = await getAuthOrganizationContext();

	const result = getLeadGenerationDataSchema.safeParse(input);
	if (!result.success) {
		throw new ValidationError(JSON.stringify(result.error.flatten()));
	}
	const parsedInput = result.data;

	return cache(
		async () => {
			const applications = await db
				.select({
					aiScore: applicationTable.aiScore,
					createdAt: applicationTable.createdAt,
				})
				.from(applicationTable)
				.where(
					sql`${applicationTable.organizationId} = ${ctx.organization.id} 
          AND ${applicationTable.createdAt} BETWEEN ${startOfDay(parsedInput.from)} AND ${endOfDay(parsedInput.to)}`,
				);

			// Group applications by date
			const grouped: Record<string, { date: string; scores: number[] }> = {};
			for (const app of applications) {
				const date = format(app.createdAt, "yyyy-MM-dd");
				if (!grouped[date]) grouped[date] = { date, scores: [] };
				if (typeof app.aiScore === "number")
					grouped[date].scores.push(app.aiScore);
				else grouped[date].scores.push(-1); // treat missing as -1 (won't be shortlisted)
			}

			const dataPoints: {
				date: string;
				applications: number;
				shortlisted: number;
			}[] = Object.values(grouped).map(({ date, scores }) => {
				const total = scores.length;
				if (total === 0) return { date, applications: 0, shortlisted: 0 };

				// Use fixed 90% threshold for shortlisted candidates
				const threshold = 90;
				const shortlisted = scores.filter(
					(s) => s >= threshold && s !== -1,
				).length;
				return { date, applications: total, shortlisted };
			});

			return dataPoints.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			);
		},
		Caching.createOrganizationKeyParts(
			OrganizationCacheKey.LeadGenerationData,
			ctx.organization.id,
			parsedInput.from.toISOString(),
			parsedInput.to.toISOString(),
		),
		{
			revalidate: defaultRevalidateTimeInSeconds,
			tags: [
				Caching.createOrganizationTag(
					OrganizationCacheKey.LeadGenerationData,
					ctx.organization.id,
				),
				Caching.createOrganizationTag(
					OrganizationCacheKey.Contacts,
					ctx.organization.id,
				),
			],
		},
	)();
}
