"use server";

import { db } from "@workspace/database/client";
import { applicationCommentTable } from "@workspace/database/schema";
import { revalidateTag } from "next/cache";

import { authOrganizationActionClient } from "~/actions/safe-action";
import { Caching, OrganizationCacheKey } from "~/data/caching";
import { addApplicationCommentSchema } from "~/schemas/applications/add-application-comment-schema";

export const addApplicationComment = authOrganizationActionClient
	.metadata({ actionName: "addApplicationComment" })
	.inputSchema(addApplicationCommentSchema)
	.action(async ({ parsedInput, ctx }) => {
		await db.insert(applicationCommentTable).values({
			applicationId: parsedInput.applicationId,
			text: parsedInput.text,
			userId: ctx.session.user.id,
		});

		revalidateTag(
			Caching.createOrganizationTag(
				OrganizationCacheKey.ApplicationComments,
				ctx.organization.id,
				parsedInput.applicationId,
			),
		);
	});
