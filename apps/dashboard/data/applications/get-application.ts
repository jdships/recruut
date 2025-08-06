import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { NotFoundError } from "@workspace/common/errors";
import { db, eq } from "@workspace/database/client";
import { applicationTable, opportunityTable } from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	OrganizationCacheKey,
} from "~/data/caching";
import type { ApplicationDto } from "~/types/dtos/application-dto";

export type GetApplicationInput = {
	id: string;
};

export async function getApplication(
	input: GetApplicationInput,
): Promise<ApplicationDto> {
	const ctx = await getAuthOrganizationContext();

	return cache(
		async () => {
			const [applicationFromDb] = await db
				.select({
					id: applicationTable.id,
					name: applicationTable.name,
					email: applicationTable.email,
					phone: applicationTable.phone,
					education: applicationTable.education,
					experience: applicationTable.experience,
					portfolioUrl: applicationTable.portfolioUrl,
					travelWillingness: applicationTable.travelWillingness,
					resumeUrl: applicationTable.resumeUrl,
					image: applicationTable.image,
					aiScore: applicationTable.aiScore,
					aiFlag: applicationTable.aiFlag,
					aiAssessment: applicationTable.aiAssessment,
					manualFlag: applicationTable.manualFlag,
					status: applicationTable.status,
					submissionData: applicationTable.submissionData,
					createdAt: applicationTable.createdAt,
					opportunityId: applicationTable.opportunityId,
					opportunityTitle: opportunityTable.title,
				})
				.from(applicationTable)
				.leftJoin(
					opportunityTable,
					eq(applicationTable.opportunityId, opportunityTable.id),
				)
				.where(eq(applicationTable.id, input.id))
				.limit(1);

			if (!applicationFromDb || applicationFromDb.opportunityId === null) {
				throw new NotFoundError("Application not found");
			}

			// Verify this application belongs to the current organization
			const [orgCheck] = await db
				.select({ organizationId: applicationTable.organizationId })
				.from(applicationTable)
				.where(eq(applicationTable.id, input.id))
				.limit(1);

			if (!orgCheck || orgCheck.organizationId !== ctx.organization.id) {
				throw new NotFoundError("Application not found");
			}

			const response: ApplicationDto = {
				id: applicationFromDb.id,
				name: applicationFromDb.name,
				email: applicationFromDb.email,
				phone: applicationFromDb.phone ?? undefined,
				education: applicationFromDb.education ?? undefined,
				experience: applicationFromDb.experience ?? undefined,
				portfolioUrl: applicationFromDb.portfolioUrl ?? undefined,
				travelWillingness: applicationFromDb.travelWillingness ?? undefined,
				resumeUrl: applicationFromDb.resumeUrl ?? undefined,
				image: applicationFromDb.image ?? undefined,
				aiScore: applicationFromDb.aiScore ?? undefined,
				aiFlag: applicationFromDb.aiFlag ?? undefined,
				aiAssessment: applicationFromDb.aiAssessment ?? undefined,
				manualFlag: applicationFromDb.manualFlag ?? undefined,
				status: applicationFromDb.status ?? undefined,
				submissionData: applicationFromDb.submissionData as
					| Record<string, unknown>
					| undefined,
				createdAt: applicationFromDb.createdAt,
				opportunityId: applicationFromDb.opportunityId!,
				opportunityTitle: applicationFromDb.opportunityTitle ?? undefined,
			};

			return response;
		},
		Caching.createOrganizationKeyParts(
			OrganizationCacheKey.Applications,
			ctx.organization.id,
			input.id,
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
