"use server";

import { NotFoundError } from "@workspace/common/errors";
import { and, db, eq } from "@workspace/database/client";
import {
	applicationTable,
	ContactRecord,
	ContactStage,
	contactTable,
} from "@workspace/database/schema";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createContactAndCaptureEvent } from "~/actions/contacts/_contact-event-capture";
import { authOrganizationActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey } from "~/data/caching";

const convertApplicationToContactSchema = z.object({
	applicationId: z.string().uuid(),
});

export const convertApplicationToContact = authOrganizationActionClient
	.metadata({ actionName: "convertApplicationToContact" })
	.inputSchema(convertApplicationToContactSchema)
	.action(async ({ parsedInput, ctx }) => {
		// Find the application
		const [application] = await db
			.select({
				id: applicationTable.id,
				name: applicationTable.name,
				email: applicationTable.email,
				phone: applicationTable.phone,
				image: applicationTable.image,
			})
			.from(applicationTable)
			.where(
				and(
					eq(applicationTable.organizationId, ctx.organization.id),
					eq(applicationTable.id, parsedInput.applicationId),
				),
			)
			.limit(1);

		if (!application) {
			throw new NotFoundError("Application not found");
		}

		// Check if contact already exists with this email
		const existingContact = application.email
			? await db
					.select({ id: contactTable.id })
					.from(contactTable)
					.where(
						and(
							eq(contactTable.organizationId, ctx.organization.id),
							eq(contactTable.email, application.email),
						),
					)
					.limit(1)
			: [];

		if (existingContact.length > 0) {
			return {
				success: false,
				error: "A contact with this email already exists",
			};
		}

		// Create contact from application data
		const newContact = await createContactAndCaptureEvent(
			{
				record: ContactRecord.PERSON,
				name: application.name,
				email: application.email,
				phone: application.phone,
				organizationId: ctx.organization.id,
				address: null,
				image: application.image, // Preserve the profile image!
				stage: ContactStage.QUALIFIED, // Applications should be qualified leads
			},
			ctx.session.user.id,
		);

		// Revalidate caches
		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.Contacts,
				ctx.organization.id,
			),
		);

		for (const membership of ctx.organization.memberships) {
			revalidateTag(
				Caching.createOrganizationTag(
					OrganizationCacheKey.Favorites,
					ctx.organization.id,
					membership.userId,
				),
			);
		}

		return {
			success: true,
			contactId: newContact.id,
		};
	});
