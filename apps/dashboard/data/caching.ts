export enum UserCacheKey {
	Organizations,
	ContactIsInFavorites,
	Profile,
	PersonalDetails,
	Preferences,
	MultiFactorAuthentication,
	Sessions,
	TransactionalEmails,
	MarketingEmails,
}

export enum OrganizationCacheKey {
	OrganizationLogo,
	LeadGenerationData,
	Contacts,
	ContactTags,
	Contact,
	ContactPageVisits,
	ContactTimelineEvents,
	ContactNotes,
	ContactTasks,
	Favorites,
	OrganizationDetails,
	BusinessHours,
	SocialMedia,
	Members,
	Invitations,
	Webhooks,
	Opportunities,
	Applications,
	ApplicationComments,
	PlanLimits,
	PlanUsage,
}

export class Caching {
	private static readonly USER_PREFIX = "user";
	private static readonly ORGANIZATION_PREFIX = "organization";

	private static joinKeyParts(...parts: string[]): string[] {
		return parts.filter((part) => part.length > 0);
	}

	private static joinTagParts(...parts: string[]): string {
		return parts.filter((part) => part.length > 0).join(":");
	}

	public static createUserKeyParts(
		key: UserCacheKey,
		userId: string,
		...additionalKeyParts: string[]
	): string[] {
		if (!userId) {
			throw new Error("User ID cannot be empty");
		}
		return Caching.joinKeyParts(
			Caching.USER_PREFIX,
			userId,
			UserCacheKey[key].toLowerCase(),
			...additionalKeyParts,
		);
	}

	public static createUserTag(
		key: UserCacheKey,
		userId: string,
		...additionalTagParts: string[]
	): string {
		if (!userId) {
			throw new Error("User ID cannot be empty");
		}
		return Caching.joinTagParts(
			Caching.USER_PREFIX,
			userId,
			UserCacheKey[key].toLowerCase(),
			...additionalTagParts,
		);
	}

	public static createOrganizationKeyParts(
		key: OrganizationCacheKey,
		organizationId: string,
		...additionalKeyParts: string[]
	): string[] {
		if (!organizationId) {
			throw new Error("Organization ID cannot be empty");
		}
		return Caching.joinKeyParts(
			Caching.ORGANIZATION_PREFIX,
			organizationId,
			OrganizationCacheKey[key].toLowerCase(),
			...additionalKeyParts,
		);
	}

	public static createOrganizationTag(
		key: OrganizationCacheKey,
		organizationId: string,
		...additionalTagParts: string[]
	): string {
		if (!organizationId) {
			throw new Error("Organization ID cannot be empty");
		}
		return Caching.joinTagParts(
			Caching.ORGANIZATION_PREFIX,
			organizationId,
			OrganizationCacheKey[key].toLowerCase(),
			...additionalTagParts,
		);
	}
}

export const defaultRevalidateTimeInSeconds =
	process.env.NODE_ENV === "production" ? 3600 : 120;
