import { dedupedAuth } from "@workspace/auth";
import { checkSession } from "@workspace/auth/session";
import { and, count, db, eq, inArray } from "@workspace/database/client";
import {
	applicationTable,
	membershipTable,
	opportunityTable,
} from "@workspace/database/schema";
import type { Column } from "exceljs";
import { Workbook } from "exceljs";
import { type NextRequest, NextResponse } from "next/server";

import { exportExcelApplicationListSchema } from "~/schemas/applications/export-excel-application-list-schema";

enum ApplicationColumn {
	Name = "name",
	Email = "email",
	Phone = "phone",
	Education = "education",
	Experience = "experience",
	PortfolioUrl = "portfolioUrl",
	TravelWillingness = "travelWillingness",
	AiScore = "aiScore",
	AiFlag = "aiFlag",
	Status = "status",
	OpportunityTitle = "opportunityTitle",
	CreatedAt = "createdAt",
}

const columns: Partial<Column>[] = [
	{ header: "Name", key: ApplicationColumn.Name },
	{ header: "Email", key: ApplicationColumn.Email },
	{ header: "Phone", key: ApplicationColumn.Phone },
	{ header: "Education", key: ApplicationColumn.Education },
	{ header: "Experience", key: ApplicationColumn.Experience },
	{ header: "Portfolio URL", key: ApplicationColumn.PortfolioUrl },
	{ header: "Travel Willingness", key: ApplicationColumn.TravelWillingness },
	{ header: "AI Score", key: ApplicationColumn.AiScore },
	{ header: "AI Flag", key: ApplicationColumn.AiFlag },
	{ header: "Status", key: ApplicationColumn.Status },
	{ header: "Position", key: ApplicationColumn.OpportunityTitle },
	{ header: "Applied Date", key: ApplicationColumn.CreatedAt },
];

type Row = {
	[ApplicationColumn.Name]: string;
	[ApplicationColumn.Email]: string;
	[ApplicationColumn.Phone]: string;
	[ApplicationColumn.Education]: string;
	[ApplicationColumn.Experience]: string;
	[ApplicationColumn.PortfolioUrl]: string;
	[ApplicationColumn.TravelWillingness]: string;
	[ApplicationColumn.AiScore]: string;
	[ApplicationColumn.AiFlag]: string;
	[ApplicationColumn.Status]: string;
	[ApplicationColumn.OpportunityTitle]: string;
	[ApplicationColumn.CreatedAt]: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
	const session = await dedupedAuth();
	if (!checkSession(session)) {
		return new NextResponse("Unauthorized", {
			status: 401,
			headers: {
				"Cache-Control": "no-store",
			},
		});
	}

	const body = await req.json();
	const bodyParsingResult = exportExcelApplicationListSchema.safeParse(body);
	if (!bodyParsingResult.success) {
		return new NextResponse(JSON.stringify(bodyParsingResult.error.flatten()), {
			status: 400,
			headers: {
				"Cache-Control": "no-store",
			},
		});
	}
	const parsedBody = bodyParsingResult?.data ?? {};

	const membershipCount = await db
		.select({ count: count() })
		.from(membershipTable)
		.where(
			and(
				eq(membershipTable.organizationId, parsedBody.organizationId),
				eq(membershipTable.userId, session.user.id),
			),
		);

	if (membershipCount[0].count === 0) {
		return new NextResponse("Unauthorized", {
			status: 401,
			headers: {
				"Cache-Control": "no-store",
			},
		});
	}

	const records = await db
		.select({
			name: applicationTable.name,
			email: applicationTable.email,
			phone: applicationTable.phone,
			education: applicationTable.education,
			experience: applicationTable.experience,
			portfolioUrl: applicationTable.portfolioUrl,
			travelWillingness: applicationTable.travelWillingness,
			aiScore: applicationTable.aiScore,
			aiFlag: applicationTable.aiFlag,
			status: applicationTable.status,
			createdAt: applicationTable.createdAt,
			opportunityTitle: opportunityTable.title,
		})
		.from(applicationTable)
		.leftJoin(
			opportunityTable,
			eq(applicationTable.opportunityId, opportunityTable.id),
		)
		.where(
			and(
				eq(applicationTable.organizationId, parsedBody.organizationId),
				parsedBody.ids
					? inArray(applicationTable.id, parsedBody.ids)
					: undefined,
			),
		);

	const now = new Date();
	const workbook = new Workbook();
	workbook.creator = session.user.name;
	workbook.lastModifiedBy = session.user.name;
	workbook.created = now;
	workbook.modified = now;
	const sheet = workbook.addWorksheet("Application List");
	sheet.columns = columns;

	for (const record of records) {
		const row: Row = {
			[ApplicationColumn.Name]: record.name,
			[ApplicationColumn.Email]: record.email ?? "",
			[ApplicationColumn.Phone]: record.phone ?? "",
			[ApplicationColumn.Education]: record.education ?? "",
			[ApplicationColumn.Experience]: record.experience ?? "",
			[ApplicationColumn.PortfolioUrl]: record.portfolioUrl ?? "",
			[ApplicationColumn.TravelWillingness]: record.travelWillingness ?? "",
			[ApplicationColumn.AiScore]: record.aiScore?.toString() ?? "",
			[ApplicationColumn.AiFlag]: record.aiFlag ?? "",
			[ApplicationColumn.Status]: record.status ?? "",
			[ApplicationColumn.OpportunityTitle]: record.opportunityTitle ?? "",
			[ApplicationColumn.CreatedAt]: record.createdAt
				.toISOString()
				.split("T")[0], // Format as YYYY-MM-DD
		};
		sheet.addRow(row).commit();
	}

	const filename = "application-list.xlsx";
	const headers = new Headers();
	headers.append("Cache-Control", "no-store");
	headers.append(
		"Content-Disposition",
		`attachment; filename=${filename}; filename*=UTF-8''${filename}`,
	);
	headers.append(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	);

	const buffer = await workbook.xlsx.writeBuffer();

	return new NextResponse(buffer, {
		headers,
	});
}
