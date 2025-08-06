import "server-only";

import { getAuthContext } from "@workspace/auth/context";
import { NotFoundError } from "@workspace/common/errors";
import { db, eq } from "@workspace/database/client";
import { userTable } from "@workspace/database/schema";
import { unstable_cache as cache } from "next/cache";

import {
	Caching,
	defaultRevalidateTimeInSeconds,
	UserCacheKey,
} from "~/data/caching";
import type { PersonalDetailsDto } from "~/types/dtos/personal-details-dto";

export async function getPersonalDetails(): Promise<PersonalDetailsDto> {
	const ctx = await getAuthContext();

	return cache(
		async () => {
			const [userFromDb] = await db
				.select({
					id: userTable.id,
					image: userTable.image,
					name: userTable.name,
					phone: userTable.phone,
					email: userTable.email,
					emailVerified: userTable.emailVerified,
				})
				.from(userTable)
				.where(eq(userTable.id, ctx.session.user.id))
				.limit(1);

			if (!userFromDb) {
				throw new NotFoundError("User not found");
			}

			const response: PersonalDetailsDto = {
				id: userFromDb.id,
				image: userFromDb.image ?? undefined,
				name: userFromDb.name,
				phone: userFromDb.phone ?? undefined,
				email: userFromDb.email ?? undefined,
				emailVerified: userFromDb.emailVerified ?? null,
			};

			return response;
		},
		Caching.createUserKeyParts(
			UserCacheKey.PersonalDetails,
			ctx.session.user.id,
		),
		{
			revalidate: defaultRevalidateTimeInSeconds,
			tags: [
				Caching.createUserTag(
					UserCacheKey.PersonalDetails,
					ctx.session.user.id,
				),
			],
		},
	)();
}
