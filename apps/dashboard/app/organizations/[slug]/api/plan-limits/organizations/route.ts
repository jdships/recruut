import { NextResponse } from "next/server";
import { canCreateMultipleOrganizations } from "~/lib/plan-limits";

export async function GET() {
	try {
		const canCreateMultiple = await canCreateMultipleOrganizations();
		return NextResponse.json({ canCreateMultiple });
	} catch (error) {
		console.error("Error checking organization limits:", error);
		return NextResponse.json(
			{ canCreateMultiple: false }, // Default to restricted on error for security
			{ status: 500 },
		);
	}
}
