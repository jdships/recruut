"use server";

import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import { applicationTable, opportunityTable } from "@workspace/database/schema";
import { sendRejectionEmail } from "@workspace/email/send-rejection-email";
import { revalidateTag } from "next/cache";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey } from "~/data/caching";
import { sendRejectionEmailSchema } from "~/schemas/applications/send-rejection-email-schema";

export const sendRejectionEmailAction = authOrganizationActionClient
	.metadata({ actionName: "sendRejectionEmail" })
	.inputSchema(sendRejectionEmailSchema)
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

		// Send rejection emails to all applicants
		const emailPromises = applications.map((application) =>
			sendRejectionEmail({
				recipient: application.email,
				applicantName: application.name,
				organizationName: ctx.organization.name,
				positionTitle: application.opportunityTitle,
				organizationWebsite: ctx.organization.website || undefined,
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
