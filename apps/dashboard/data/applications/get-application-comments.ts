import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { and, asc, db, eq } from "@workspace/database/client";
import {
	applicationCommentTable,
	applicationTable,
	userTable,
} from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";
import { z } from "zod";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	OrganizationCacheKey,
} from "~/data/caching";
import type { ApplicationCommentDto } from "~/types/dtos/application-comment-dto";

const getApplicationCommentsSchema = z.object({
	applicationId: z.string().uuid(),
});

export type GetApplicationCommentsSchema = z.infer<
	typeof getApplicationCommentsSchema
>;

export async function getApplicationComments(
	input: GetApplicationCommentsSchema,
): Promise<ApplicationCommentDto[]> {
	const ctx = await getAuthOrganizationContext();
	const result = getApplicationCommentsSchema.safeParse(input);
	if (!result.success) {
		throw new Error(`Invalid input: ${JSON.stringify(result.error.flatten())}`);
	}
	const parsedInput = result.data;

	return cache(
		async () => {
			const applicationComments = await db
				.select({
					id: applicationCommentTable.id,
					applicationId: applicationCommentTable.applicationId,
					text: applicationCommentTable.text,
					createdAt: applicationCommentTable.createdAt,
					updatedAt: applicationCommentTable.updatedAt,
					user: {
						id: userTable.id,
						name: userTable.name,
						image: userTable.image,
					},
				})
				.from(applicationCommentTable)
				.innerJoin(userTable, eq(applicationCommentTable.userId, userTable.id))
				.innerJoin(
					applicationTable,
					eq(applicationCommentTable.applicationId, applicationTable.id),
				)
				.where(
					and(
						eq(applicationTable.organizationId, ctx.organization.id),
						eq(
							applicationCommentTable.applicationId,
							parsedInput.applicationId,
						),
					),
				)
				.orderBy(asc(applicationCommentTable.createdAt));

			const response: ApplicationCommentDto[] = applicationComments.map(
				(comment) => ({
					id: comment.id,
					applicationId: comment.applicationId,
					text: comment.text ?? undefined,
					edited: comment.createdAt.getTime() !== comment.updatedAt.getTime(),
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					sender: {
						id: comment.user.id,
						name: comment.user.name,
						image: comment.user.image ?? undefined,
					},
				}),
			);

			return response;
		},
		Caching.createOrganizationKeyParts(
			OrganizationCacheKey.ApplicationComments,
			ctx.organization.id,
			parsedInput.applicationId,
		),
		{
			revalidate: defaultRevalidateTimeInSeconds,
			tags: [
				Caching.createOrganizationTag(
					OrganizationCacheKey.ApplicationComments,
					ctx.organization.id,
					parsedInput.applicationId,
				),
			],
		},
	)();
}
