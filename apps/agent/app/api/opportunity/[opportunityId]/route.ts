import { db } from "@workspace/database/client";
import { opportunityTable } from "@workspace/database/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ opportunityId: string }> },
) {
	try {
		const params = await context.params;
		const opportunityId = params.opportunityId;

		const opportunity = await db
			.select()
			.from(opportunityTable)
			.where(eq(opportunityTable.id, opportunityId))
			.limit(1);

		if (!opportunity.length) {
			return NextResponse.json(
				{ error: "Opportunity not found" },
				{ status: 404 },
			);
		}

		// Fetch questions for this opportunity
		const standardQuestions = [
			"What is your phone number?",
			"Tell me about your relevant experience for this position.",
			"What is your educational background?",
			"Do you have a portfolio or website you'd like to share?",
			"Are you willing to travel if required for this role?",
			"Can you describe a challenging technical problem you solved recently and how you approached it?",
		];

		const o = opportunity[0];
		const opportunityData = {
			id: o.id,
			title: o.title,
			description: o.description,
			status: o.status,
			questions: standardQuestions,
			organizationId: o.organizationId,
			createdAt: o.createdAt,
			updatedAt: o.updatedAt,
			positionLink: o.positionLink,
			documents: o.documents ?? [],
			hiringManagerEmail: o.hiringManagerEmail,
			moreContext: o.moreContext,
		};

		return NextResponse.json(opportunityData);
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
