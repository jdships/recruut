"use server";

import { db } from "@workspace/database/client";
import {
	ApplicationFlag,
	ApplicationStatus,
	applicationTable,
} from "@workspace/database/schema";
import { randomUUID } from "crypto";
import { z } from "zod";

// Define the schema for applicant submission
export const createApplicationSchema = z.object({
	organizationId: z.string().uuid(),
	opportunityId: z.string().uuid(),
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	education: z.string().optional(),
	experience: z.string().optional(),
	portfolioUrl: z.string().url().optional(),
	travelWillingness: z.string().optional(),
	resumeUrl: z.string().url().optional(),
	image: z.string().url().optional(), // <-- new field
	submissionData: z.record(z.any()), // raw answers
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export async function createApplication(input: CreateApplicationInput) {
	const parsed = createApplicationSchema.safeParse(input);
	if (!parsed.success) {
		return {
			serverError: null,
			validationErrors: parsed.error.flatten().fieldErrors,
		};
	}
	const data = parsed.data;
	const id = randomUUID();
	await db.insert(applicationTable).values({
		id,
		organizationId: data.organizationId,
		opportunityId: data.opportunityId,
		name: data.name,
		email: data.email,
		phone: data.phone,
		education: data.education,
		experience: data.experience,
		portfolioUrl: data.portfolioUrl,
		travelWillingness: data.travelWillingness,
		resumeUrl: data.resumeUrl,
		image: data.image ?? null, // <-- store image or null
		aiScore: null, // to be set by AI later
		aiFlag: ApplicationFlag.NORMAL,
		manualFlag: null,
		flagHistory: null,
		submissionData: data.submissionData,
		status: ApplicationStatus.SUBMITTED,
	});
	return { serverError: null, validationErrors: null, data: { id } };
}
