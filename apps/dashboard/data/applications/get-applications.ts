import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { db, eq } from "@workspace/database/client";
import { applicationTable, opportunityTable } from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";
import { Caching, OrganizationCacheKey } from "../caching";

export type ApplicationRow = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	education?: string;
	experience?: string;
	portfolioUrl?: string;
	travelWillingness?: string;
	resumeUrl?: string;
	aiScore?: number;
	aiFlag?: string;
	manualFlag?: string;
	status?: string;
	opportunityId?: string;
	opportunityTitle?: string;
	createdAt?: string;
	image?: string;
	record?: string;
};

function normalizeApplication(row: Record<string, unknown>): ApplicationRow {
	return {
		id: row.id as string,
		name: row.name as string,
		email: row.email as string,
		phone: row.phone as string | undefined,
		education: row.education as string | undefined,
		experience: row.experience as string | undefined,
		portfolioUrl: row.portfolioUrl as string | undefined,
		travelWillingness: row.travelWillingness as string | undefined,
		resumeUrl: row.resumeUrl as string | undefined,
		aiScore: row.aiScore as number | undefined,
		aiFlag: row.aiFlag as string | undefined,
		manualFlag: row.manualFlag as string | undefined,
		status: row.status as string | undefined,
		opportunityId: row.opportunityId as string | undefined,
		opportunityTitle: row.opportunityTitle as string | undefined,
		createdAt: row.createdAt
			? typeof row.createdAt === "string"
				? row.createdAt
				: (row.createdAt as Date).toISOString()
			: undefined,
		image: row.image as string | undefined,
		record: row.record as string | undefined,
	};
}

export type GetApplicationsParams = {
	searchQuery?: string;
	pageIndex?: number;
	pageSize?: number;
	opportunity?: string;
	flags?: string[];
};

export async function getApplications(
	params: GetApplicationsParams = {},
): Promise<{
	applications: ApplicationRow[];
	filteredCount: number;
	totalCount: number;
}> {
	const ctx = await getAuthOrganizationContext();
	const {
		searchQuery = "",
		pageIndex = 0,
		pageSize = 50,
		opportunity = "",
		flags = [],
	} = params;

	return cache(
		async () => {
			// Base query
			const query = db
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
					aiScore: applicationTable.aiScore,
					aiFlag: applicationTable.aiFlag,
					manualFlag: applicationTable.manualFlag,
					status: applicationTable.status,
					createdAt: applicationTable.createdAt,
					opportunityId: applicationTable.opportunityId,
					opportunityTitle: opportunityTable.title,
					image: applicationTable.image,
				})
				.from(applicationTable)
				.leftJoin(
					opportunityTable,
					eq(applicationTable.opportunityId, opportunityTable.id),
				)
				.where(eq(applicationTable.organizationId, ctx.organization.id));

			let filteredRows = await query;

			// Filter by opportunity (by id)
			if (opportunity && opportunity !== "") {
				filteredRows = filteredRows.filter(
					(row) => row.opportunityId === opportunity,
				);
			}

			// Filter by flags (aiFlag or manualFlag in flags array)
			if (flags && flags.length > 0) {
				filteredRows = filteredRows.filter(
					(row) =>
						flags.includes(String(row.aiFlag ?? "")) ||
						flags.includes(String(row.manualFlag ?? "")),
				);
			}

			// Filter by search query
			if (searchQuery) {
				const lower = searchQuery.toLowerCase();
				filteredRows = filteredRows.filter(
					(row) =>
						row.name.toLowerCase().includes(lower) ||
						row.email.toLowerCase().includes(lower),
				);
			}
			const totalCount = filteredRows.length;
			// Pagination
			const paginatedRows = filteredRows.slice(
				pageIndex * pageSize,
				(pageIndex + 1) * pageSize,
			);
			return {
				applications: paginatedRows.map(normalizeApplication),
				filteredCount: totalCount,
				totalCount: totalCount,
			};
		},
		[
			String(OrganizationCacheKey.Applications),
			ctx.organization.id,
			searchQuery,
			String(pageIndex),
			String(pageSize),
			opportunity,
			flags.join(","),
		],
		{
			tags: [
				Caching.createOrganizationTag(
					OrganizationCacheKey.Applications,
					ctx.organization.id,
				),
			],
			revalidate: 60,
		},
	)();
}
