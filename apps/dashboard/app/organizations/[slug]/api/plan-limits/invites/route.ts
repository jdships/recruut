import { NextResponse } from "next/server";
import { canInviteMembers } from "~/lib/plan-limits";

export async function GET() {
	try {
		const canInvite = await canInviteMembers();
		return NextResponse.json({ canInvite });
	} catch (error) {
		console.error("Error checking invite limits:", error);
		return NextResponse.json(
			{ canInvite: false }, // Default to restricted on error for security
			{ status: 500 },
		);
	}
}
