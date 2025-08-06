// Convention:
// - Everything lowercase is an object
// - Everything uppercase is a string (the route)

import { keys } from "../keys";

export const baseUrl = {
	Dashboard: keys().NEXT_PUBLIC_DASHBOARD_URL,
	Marketing: keys().NEXT_PUBLIC_MARKETING_URL,
	Agent: keys().NEXT_PUBLIC_AGENT_URL,
} as const;

export const routes = {
	dashboard: {
		Api: `${baseUrl.Dashboard}/api`,
		auth: {
			changeEmail: {
				Expired: `${baseUrl.Dashboard}/auth/change-email/expired`,
				Index: `${baseUrl.Dashboard}/auth/change-email`,
				Invalid: `${baseUrl.Dashboard}/auth/change-email/invalid`,
				Request: `${baseUrl.Dashboard}/auth/change-email/request`,
			},
			Error: `${baseUrl.Dashboard}/auth/error`,
			forgetPassword: {
				Index: `${baseUrl.Dashboard}/auth/forgot-password`,
				Success: `${baseUrl.Dashboard}/auth/forgot-password/success`,
			},
			Index: `${baseUrl.Dashboard}/auth`,
			RecoveryCode: `${baseUrl.Dashboard}/auth/recovery-code`,
			resetPassword: {
				Expired: `${baseUrl.Dashboard}/auth/reset-password/expired`,
				Index: `${baseUrl.Dashboard}/auth/reset-password`,
				Request: `${baseUrl.Dashboard}/auth/reset-password/request`,
				Success: `${baseUrl.Dashboard}/auth/reset-password/success`,
			},
			SignIn: `${baseUrl.Dashboard}/auth/sign-in`,
			SignUp: `${baseUrl.Dashboard}/auth/sign-up`,
			Totp: `${baseUrl.Dashboard}/auth/totp`,
			verifyEmail: {
				Expired: `${baseUrl.Dashboard}/auth/verify-email/expired`,
				Index: `${baseUrl.Dashboard}/auth/verify-email`,
				Request: `${baseUrl.Dashboard}/auth/verify-email/request`,
				Success: `${baseUrl.Dashboard}/auth/verify-email/success`,
			},
		},
		Index: `${baseUrl.Dashboard}/`,
		invitations: {
			AlreadyAccepted: `${baseUrl.Dashboard}/invitations/already-accepted`,
			Index: `${baseUrl.Dashboard}/invitations`,
			Request: `${baseUrl.Dashboard}/invitations/request`,
			Revoked: `${baseUrl.Dashboard}/invitations/revoked`,
		},
		onboarding: {
			Index: `${baseUrl.Dashboard}/onboarding`,
			Organization: `${baseUrl.Dashboard}/onboarding/organization`,
			User: `${baseUrl.Dashboard}/onboarding/user`,
		},
		organizations: {
			Index: `${baseUrl.Dashboard}/organizations`,
			slug: {
				ChoosePlan: `${baseUrl.Dashboard}/organizations/[slug]/choose-plan`,
				Contacts: `${baseUrl.Dashboard}/organizations/[slug]/contacts`,
				Home: `${baseUrl.Dashboard}/organizations/[slug]/home`,
				Applications: `${baseUrl.Dashboard}/organizations/[slug]/applications`,
				Opportunities: `${baseUrl.Dashboard}/organizations/[slug]/opportunities`,
				Index: `${baseUrl.Dashboard}/organizations/[slug]`,
				settings: {
					account: {
						Index: `${baseUrl.Dashboard}/organizations/[slug]/settings/account`,
						Notifications: `${baseUrl.Dashboard}/organizations/[slug]/settings/account/notifications`,
						Profile: `${baseUrl.Dashboard}/organizations/[slug]/settings/account/profile`,
						Security: `${baseUrl.Dashboard}/organizations/[slug]/settings/account/security`,
					},
					Index: `${baseUrl.Dashboard}/organizations/[slug]/settings`,
					organization: {
						Billing: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/billing`,
						General: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/general`,
						Index: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization`,
						Members: `${baseUrl.Dashboard}/organizations/[slug]/settings/organization/members`,
					},
				},
			},
		},
	},
	marketing: {
		Contact: `${baseUrl.Marketing}/contact`,
		CookiePolicy: `${baseUrl.Marketing}/cookie-policy`,
		Index: `${baseUrl.Marketing}/`,
		PrivacyPolicy: `${baseUrl.Marketing}/privacy-policy`,
		Story: `${baseUrl.Marketing}/story`,
		TermsOfUse: `${baseUrl.Marketing}/terms-of-use`,
	},
} as const;

type ExtractSlugRoutes<T> = T extends Record<string, unknown>
	? {
			[K in keyof T]: T[K] extends string
				? T[K] extends `${string}[slug]${string}`
					? T[K]
					: never
				: ExtractSlugRoutes<T[K]>;
		}[keyof T]
	: never;

type OrganizationsSlugRoutes = ExtractSlugRoutes<
	typeof routes.dashboard.organizations.slug
>;

export function replaceOrgSlug(
	route: OrganizationsSlugRoutes,
	slug: string,
): string {
	if (route.indexOf("[slug]") === -1) {
		throw new Error(
			`Invalid route: ${route}. Route must contain the placeholder [slug].`,
		);
	}

	return route.replace("[slug]", slug);
}

export function getPathname(route: string, baseUrl: string): string {
	return new URL(route, baseUrl).pathname;
}

export function getOrganizationLogoUrl(
	organizationId: string,
	hash: string,
): string {
	return `${routes.dashboard.Api}/organization-logos/${organizationId}?v=${hash}`;
}

export function getUserImageUrl(userId: string, hash: string): string {
	return `${routes.dashboard.Api}/user-images/${userId}?v=${hash}`;
}

export function getContactImageUrl(contactId: string, hash: string): string {
	return `${routes.dashboard.Api}/contact-images/${contactId}?v=${hash}`;
}
