import { dedupedAuth } from "@workspace/auth";
import { getRequestStoragePathname } from "@workspace/auth/redirect";
import { baseUrl, getPathname, routes } from "@workspace/routes";
import { Logo } from "@workspace/ui/components/logo";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type * as React from "react";

import { createTitle } from "~/lib/formatters";

export const metadata: Metadata = {
	title: createTitle("Auth"),
};

function isChangeEmailRoute(): boolean {
	const pathname = getRequestStoragePathname();
	return (
		!!pathname &&
		pathname.startsWith(
			getPathname(routes.dashboard.auth.changeEmail.Index, baseUrl.Dashboard),
		)
	);
}

export default async function AuthLayout({
	children,
}: React.PropsWithChildren): Promise<React.JSX.Element> {
	const session = await dedupedAuth();
	if (!isChangeEmailRoute() && session) {
		return redirect(routes.dashboard.organizations.Index);
	}
	return (
		<main className="h-screen dark:bg-background bg-gray-50 px-4">
			<div className="flex items-center justify-center min-h-screen">
				<div className="mx-auto w-full min-w-[320px] space-y-6 max-w-sm">
					<Link href={routes.marketing.Index} className="block w-fit mx-auto">
						<Logo hideWordmark={true} />
					</Link>
					{children}
				</div>
			</div>
			<ThemeToggle className="fixed top-2 right-2 rounded-full" />
		</main>
	);
}
