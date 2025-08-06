"use server";

import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import { applicationTable, opportunityTable } from "@workspace/database/schema";
import { sendInterviewRequestEmail } from "@workspace/email/send-interview-request-email";
import { revalidateTag } from "next/cache";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey } from "~/data/caching";
import { sendInterviewRequestEmailSchema } from "~/schemas/applications/send-interview-request-email-schema";

export const sendInterviewRequestEmailAction = authOrganizationActionClient
	.metadata({ actionName: "sendInterviewRequestEmail" })
	.inputSchema(sendInterviewRequestEmailSchema)
	.action(async ({ parsedInput, ctx }) => {
		// Fetch applications with opportunity details
		const applications = await db
			.select({
				id: applicationTable.id,
				name: applicationTable.name,
				email: applicationTable.email,
				opportunityId: applicationTable.opportunityId,
				opportunityTitle: opportunityTable.title,
			})
			.from(applicationTable)
			.innerJoin(
				opportunityTable,
				eq(applicationTable.opportunityId, opportunityTable.id),
			)
			.where(
				and(
					eq(applicationTable.organizationId, ctx.organization.id),
					eq(opportunityTable.organizationId, ctx.organization.id),
					// Filter by the provided application IDs
					...parsedInput.applicationIds.map((id) =>
						eq(applicationTable.id, id),
					),
				),
			);

		if (applications.length === 0) {
			throw new NotFoundError("No applications found");
		}

		// Send interview request emails to all applicants
		const emailPromises = applications.map((application) =>
			sendInterviewRequestEmail({
				recipient: application.email,
				applicantName: application.name,
				organizationName: ctx.organization.name,
				positionTitle: application.opportunityTitle,
				organizationWebsite: ctx.organization.website || undefined,
				// TODO: Add scheduling link when available
				schedulingLink: undefined,
			}),
		);

		await Promise.all(emailPromises);

		// Revalidate the applications cache
		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Applications,
				ctx.organization.id,
			),
		);

		return {
			success: true,
			count: applications.length,
		};
	});
