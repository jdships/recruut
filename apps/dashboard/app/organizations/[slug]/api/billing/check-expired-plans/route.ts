/**
 * Background job to check and revert expired plans to free
 * This should be called periodically (daily) via a cron job or similar
 */

import { and, db, eq, lt, ne } from "@workspace/database/client";
import { organizationTable } from "@workspace/database/schema";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Verify the request is authorized (you might want to add an API key here)
		const authHeader = request.headers.get("authorization");
		const expectedToken = process.env.CRON_SECRET || "your-secret-token";

		if (authHeader !== `Bearer ${expectedToken}`) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const now = new Date();

		// Find all organizations with expired plans
		const expiredOrganizations = await db
			.select({
				id: organizationTable.id,
				slug: organizationTable.slug,
				name: organizationTable.name,
				plan: organizationTable.plan,
				planExpiresAt: organizationTable.planExpiresAt,
			})
			.from(organizationTable)
			.where(
				// Plan has expired and is not already free
				and(
					lt(organizationTable.planExpiresAt, now),
					ne(organizationTable.plan, "free"),
				),
			);

		console.log(
			`Found ${expiredOrganizations.length} organizations with expired plans`,
		);

		if (expiredOrganizations.length === 0) {
			return NextResponse.json({
				message: "No expired plans found",
				processed: 0,
			});
		}

		// Revert expired organizations to free plan
		const revertedOrganizations = [];

		for (const org of expiredOrganizations) {
			try {
				await db
					.update(organizationTable)
					.set({
						plan: "free",
						planExpiresAt: null, // Clear expiry date for free plan
					})
					.where(eq(organizationTable.id, org.id));

				revertedOrganizations.push({
					id: org.id,
					slug: org.slug,
					name: org.name,
					previousPlan: org.plan,
					expiredAt: org.planExpiresAt,
				});

				console.log(
					`Reverted organization ${org.slug} (${org.name}) from ${org.plan} to free plan`,
				);
			} catch (error) {
				console.error(`Failed to revert organization ${org.slug}:`, error);
				// Continue with other organizations even if one fails
			}
		}

		return NextResponse.json({
			message: `Successfully processed ${revertedOrganizations.length} expired plans`,
			processed: revertedOrganizations.length,
			reverted: revertedOrganizations,
		});
	} catch (error) {
		console.error("Error checking expired plans:", error);
		return NextResponse.json(
			{ error: "Failed to process expired plans" },
			{ status: 500 },
		);
	}
}

// Also allow GET for testing purposes
export async function GET(_request: NextRequest) {
	try {
		// In GET mode, just check and return what would be processed without actually changing anything
		const now = new Date();

		const expiredOrganizations = await db
			.select({
				id: organizationTable.id,
				slug: organizationTable.slug,
				name: organizationTable.name,
				plan: organizationTable.plan,
				planExpiresAt: organizationTable.planExpiresAt,
			})
			.from(organizationTable)
			.where(
				and(
					lt(organizationTable.planExpiresAt, now),
					ne(organizationTable.plan, "free"),
				),
			);

		return NextResponse.json({
			message: `Found ${expiredOrganizations.length} organizations with expired plans`,
			preview: expiredOrganizations,
			note: "This is a preview. Use POST to actually process the expired plans.",
		});
	} catch (error) {
		console.error("Error previewing expired plans:", error);
		return NextResponse.json(
			{ error: "Failed to preview expired plans" },
			{ status: 500 },
		);
	}
}
