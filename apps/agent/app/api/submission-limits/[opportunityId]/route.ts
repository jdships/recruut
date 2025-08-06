import { NextResponse } from "next/server";
import { canAcceptApplications } from "~/lib/submission-limits";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ opportunityId: string }> },
) {
	try {
		const { opportunityId } = await params;

		const result = await canAcceptApplications(opportunityId);

		return NextResponse.json({
			canAccept: result.allowed,
			reason: result.reason,
			limit: result.limit,
			current: result.current,
		});
	} catch (error) {
		console.error("Error checking submission limits:", error);
		// Default to allowing submissions if check fails
		return NextResponse.json({
			canAccept: true,
		});
	}
}
