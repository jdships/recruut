import { Caching, OrganizationCacheKey } from "@workspace/common/caching";
import { db } from "@workspace/database/client";
import {
	ApplicationFlag,
	ApplicationStatus,
	applicationTable,
	ContactRecord,
	ContactStage,
	contactTable,
	opportunityTable,
} from "@workspace/database/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type SubmissionData = {
	answers?: string[];
	advancedScreening?: unknown[];
};

// Helper function to calculate AI score
function calculateAiScore(
	submissionData: SubmissionData | null | undefined,
): number {
	if (!submissionData || !submissionData.answers) {
		return 0;
	}

	let score = 0;
	const answers: string[] = submissionData.answers;

	// Basic scoring logic - can be enhanced with more sophisticated AI
	if (answers.length > 0) {
		score += answers.length * 10; // Base score for number of answers

		// Check for completeness
		const completenessScore = Math.min(answers.length / 5, 1) * 20;
		score += completenessScore;

		// Check for quality indicators (length, keywords, etc.)
		const qualityScore = answers.reduce((acc: number, answer: string) => {
			if (typeof answer === "string" && answer.length > 50) {
				acc += 5;
			}
			return acc;
		}, 0);
		score += qualityScore;
	}

	return Math.min(score, 100); // Cap at 100
}

// Helper function to determine AI flag
function determineAiFlag(
	score: number,
	submissionData: SubmissionData | null | undefined,
): ApplicationFlag {
	if (!submissionData || !submissionData.answers) {
		return ApplicationFlag.NORMAL;
	}

	// Check for obvious spam indicators (more specific)
	const answers: string[] = submissionData.answers;
	const hasSpamIndicators = answers.some((answer: string) => {
		if (typeof answer === "string") {
			const lowerAnswer = answer.toLowerCase();
			return (
				lowerAnswer.includes("spam") ||
				lowerAnswer.includes("test123") ||
				lowerAnswer === "test" ||
				lowerAnswer.length < 2 ||
				/^[a-zA-Z]$/.test(answer) || // Single letter answers
				(/^\d+$/.test(answer) && answer.length < 3) // Very short numeric answers
			);
		}
		return false;
	});

	// Only flag as spam if there are multiple spam indicators or very obvious spam
	const spamCount = answers.filter((answer) => {
		if (typeof answer === "string") {
			const lowerAnswer = answer.toLowerCase();
			return (
				lowerAnswer.includes("spam") ||
				lowerAnswer.includes("test123") ||
				lowerAnswer === "test" ||
				lowerAnswer.length < 2
			);
		}
		return false;
	}).length;

	if (spamCount > 1 || hasSpamIndicators) {
		return ApplicationFlag.SPAM;
	}

	// Score-based flagging
	if (score >= 80) {
		return ApplicationFlag.GREAT;
	} else if (score >= 60) {
		return ApplicationFlag.HIGH_LEVEL;
	} else if (score < 10) {
		return ApplicationFlag.SPAM;
	}

	return ApplicationFlag.NORMAL;
}

export async function POST(request: Request) {
	try {
		const data = await request.json();

		const {
			opportunityId,
			organizationId,
			name,
			email,
			phone,
			education,
			experience,
			portfolioUrl,
			travelWillingness,
			resumeUrl,
			image,
			submissionData,
			aiScore,
		} = data;

		// Validate required fields
		if (!opportunityId || !organizationId || !name || !email) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if opportunity exists and is active
		const [opportunity] = await db
			.select({ status: opportunityTable.status })
			.from(opportunityTable)
			.where(eq(opportunityTable.id, opportunityId))
			.limit(1);

		if (!opportunity) {
			return NextResponse.json(
				{ error: "Opportunity not found" },
				{ status: 404 },
			);
		}

		if (opportunity.status === "paused") {
			return NextResponse.json(
				{
					error:
						"This opportunity is currently paused and not accepting new applications",
				},
				{ status: 403 },
			);
		}

		// Check if opportunity has reached submission limits
		try {
			const { canAcceptApplications } = await import("~/lib/submission-limits");
			const canAccept = await canAcceptApplications(opportunityId);

			if (!canAccept.allowed) {
				return NextResponse.json(
					{ error: "This opportunity has reached its application limit" },
					{ status: 403 },
				);
			}
		} catch (error) {
			console.error("Error checking application limits:", error);
			// Continue if limit check fails to avoid blocking legitimate applications
		}

		// Create new application
		const applicationId = randomUUID();
		const contactId = randomUUID();

		// Use the AI score from advanced screening if available, otherwise calculate basic score
		const calculatedAiScore =
			aiScore !== null && aiScore !== undefined
				? aiScore
				: calculateAiScore(submissionData);
		const aiFlag = determineAiFlag(calculatedAiScore, submissionData);

		// Create contact record first
		const _newContact = await db
			.insert(contactTable)
			.values({
				id: contactId,
				organizationId,
				name,
				email,
				phone: phone || null,
				stage: ContactStage.LEAD,
				record: ContactRecord.PERSON,
			})
			.returning();

		// Create application record with original experience (will be updated with summary later)
		const newApplication = await db
			.insert(applicationTable)
			.values({
				id: applicationId,
				organizationId,
				opportunityId,
				name,
				email,
				phone: phone || null,
				education: education || null,
				experience: experience || null, // Will be updated with summary
				portfolioUrl: portfolioUrl || null,
				travelWillingness: travelWillingness || null,
				resumeUrl: resumeUrl || null,
				image: image || null,
				aiScore: calculatedAiScore,
				aiFlag: aiFlag,
				submissionData: submissionData || null,
				status: ApplicationStatus.SUBMITTED,
			})
			.returning();

		// Generate experience summary and comprehensive AI assessment
		let comprehensiveAssessment = null;
		let summarizedExperience = experience; // Default to original experience

		try {
			const opportunity = await db
				.select()
				.from(opportunityTable)
				.where(eq(opportunityTable.id, opportunityId));

			const opportunityTitle = opportunity[0]?.title || "Position";

			// Generate experience summary if raw experience is provided
			if (experience && experience.length > 100) {
				// Only summarize if it's substantial
				try {
					const summaryResponse = await fetch(
						`${process.env.NEXT_PUBLIC_AGENT_URL}/api/application/summarize-experience`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								rawExperience: experience,
								position: opportunityTitle,
							}),
						},
					);

					if (summaryResponse.ok) {
						const summaryData = await summaryResponse.json();
						summarizedExperience = summaryData.summary;
					} else {
						console.error("Failed to generate experience summary");
					}
				} catch (error) {
					console.error("Error generating experience summary:", error);
				}
			}

			const assessmentResponse = await fetch(
				`${process.env.NEXT_PUBLIC_AGENT_URL}/api/assessment/generate`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						email,
						position: opportunityTitle,
						education,
						experience: summarizedExperience, // Use summarized experience
						portfolioUrl,
						travelWillingness,
						responses: submissionData?.answers || [],
						advancedScreening: submissionData?.advancedScreening || [],
						resumeUrl,
						aiScore: calculatedAiScore,
					}),
				},
			);

			if (assessmentResponse.ok) {
				const assessmentData = await assessmentResponse.json();
				comprehensiveAssessment = assessmentData.assessment;

				// Update the application with the assessment and summarized experience
				await db
					.update(applicationTable)
					.set({
						aiAssessment: comprehensiveAssessment,
						experience: summarizedExperience, // Update with summarized experience
					})
					.where(eq(applicationTable.id, applicationId));
			} else {
				console.error("Failed to generate comprehensive assessment");
			}
		} catch (error) {
			console.error("Error generating comprehensive assessment:", error);
		}

		// Revalidate cache tags
		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Applications,
				organizationId,
			),
		);
		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Contacts,
				organizationId,
			),
		);
		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.PlanUsage,
				organizationId,
			),
		);

		return NextResponse.json({
			success: true,
			application: newApplication[0],
			assessment: comprehensiveAssessment,
		});
	} catch (error) {
		console.error("Error saving application:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
