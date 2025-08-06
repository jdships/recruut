import "server-only";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { ForbiddenError, NotFoundError } from "@workspace/common/errors";
import { db, eq } from "@workspace/database/client";
import { userTable } from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	UserCacheKey,
} from "~/data/caching";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export async function getProfile(): Promise<ProfileDto> {
	const ctx = await getAuthOrganizationContext();
	const activeMembership = ctx.session.user.memberships.find(
		(m) => m.organizationId === ctx.organization.id,
	);
	if (!activeMembership) {
		throw new ForbiddenError("User is not a member of this organization");
	}

	return cache(
		async () => {
			const [userFromDb] = await db
				.select({
					id: userTable.id,
					image: userTable.image,
					name: userTable.name,
					email: userTable.email,
					locale: userTable.locale,
					emailVerified: userTable.emailVerified,
				})
				.from(userTable)
				.where(eq(userTable.id, ctx.session.user.id))
				.limit(1);

			if (!userFromDb) {
				throw new NotFoundError("User not found");
			}

			const response: Omit<ProfileDto, "isOwner" | "role"> = {
				id: userFromDb.id,
				image: userFromDb.image ?? undefined,
				name: userFromDb.name,
				email: userFromDb.email ?? undefined,
				locale: userFromDb.locale,
				emailVerified: userFromDb.emailVerified ?? null,
			};

			return response;
		},
		Caching.createUserKeyParts(UserCacheKey.Profile, ctx.session.user.id),
		{
			revalidate: defaultRevalidateTimeInSeconds,
			tags: [
				Caching.createUserTag(UserCacheKey.Profile, ctx.session.user.id),
				Caching.createUserTag(
					UserCacheKey.PersonalDetails,
					ctx.session.user.id,
				),
				Caching.createUserTag(UserCacheKey.Preferences, ctx.session.user.id),
			],
		},
	)().then((profile) => ({
		...profile,
		// We don't want to cache these two fields
		isOwner: activeMembership.isOwner,
		role: activeMembership.role,
	}));
}
