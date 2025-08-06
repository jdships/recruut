import { APP_NAME } from "@workspace/common/app";
import { routes } from "@workspace/routes";
import { Logo } from "@workspace/ui/components/logo";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { SignOutButton } from "~/components/onboarding/sign-out-button";
import { OrganizationList } from "~/components/organizations/organization-list";
import { getOrganizations } from "~/data/organization/get-organizations";
import { createTitle } from "~/lib/formatters";

export const metadata: Metadata = {
	title: createTitle("Organizations"),
};

export default async function OrganizationsPage(): Promise<React.JSX.Element> {
	const organizations = await getOrganizations();
	return (
		<div className="relative min-h-screen bg-background">
			<div className="fixed inset-x-0 top-0 z-10 mx-auto flex min-w-80 items-center justify-center bg-background p-4 mt-10">
				<Link href={routes.marketing.Index}>
					<Logo hideWordmark />
				</Link>
			</div>
			<div className="relative mx-auto flex w-full min-w-80 max-w-lg flex-col items-stretch justify-start gap-6 pt-24">
				<OrganizationList organizations={organizations} />
			</div>
			<div className="fixed inset-x-0 bottom-0 z-10 mx-auto mt-auto flex w-full min-w-80 max-w-lg flex-row items-center justify-center gap-4 bg-background p-4 text-xs text-muted-foreground">
				<span>
					© {new Date().getFullYear()} {APP_NAME}
				</span>
				<Link
					prefetch={false}
					href={routes.marketing.TermsOfUse}
					className="hidden underline sm:inline"
					rel="noopener noreferrer"
					target="_blank"
				>
					Terms of Use
				</Link>
				<Link
					prefetch={false}
					href={routes.marketing.PrivacyPolicy}
					className="hidden underline sm:inline"
					rel="noopener noreferrer"
					target="_blank"
				>
					Privacy Policy
				</Link>
				<SignOutButton
					type="button"
					variant="link"
					className="ml-auto h-fit rounded-none p-0 text-xs font-normal text-muted-foreground underline"
				>
					Sign out
				</SignOutButton>
				<ThemeSwitcher />
			</div>
		</div>
	);
}
