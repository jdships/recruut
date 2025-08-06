import "@workspace/ui/globals.css";

import { APP_DESCRIPTION, APP_NAME } from "@workspace/common/app";
import { baseUrl } from "@workspace/routes";
import { Toaster } from "@workspace/ui/components/sonner";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import * as React from "react";

import { Footer } from "~/components/footer";
import { CookieBanner } from "~/components/fragments/cookie-banner";
import { Navbar } from "~/components/navbar";
import CrispWrapper from "../components/crisp-wrapper";
import { Providers } from "./providers";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl.Marketing),
	title: APP_NAME,
	description: APP_DESCRIPTION,
	manifest: `${baseUrl.Marketing}/manifest`,
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: APP_NAME,
		title: APP_NAME,
		description: APP_DESCRIPTION,
		url: baseUrl.Marketing,
		images: {
			url: `${baseUrl.Marketing}/og-image.png`,
			width: 1200,
			height: 630,
			alt: APP_NAME,
		},
	},
	robots: {
		index: true,
		follow: true,
	},
	icons: [
		{
			rel: "icon",
			type: "image/svg+xml",
			url: "/favicon.svg",
		},
		{
			rel: "icon",
			type: "image/svg+xml",
			url: "/favicon-light.svg",
			media: "(prefers-color-scheme: light)",
		},
		{
			rel: "icon",
			type: "image/svg+xml",
			url: "/favicon-dark.svg",
			media: "(prefers-color-scheme: dark)",
		},
	],
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
	children,
}: React.PropsWithChildren): Promise<React.JSX.Element> {
	return (
		<html lang="en" className="size-full min-h-screen" suppressHydrationWarning>
			<body className={`${inter.className} size-full bg-background-muted`}>
				<Providers>
					<div>
						<Navbar />
						{children}
						<Footer />
						<CookieBanner />
					</div>
					<React.Suspense>
						<Toaster />
					</React.Suspense>
					<CrispWrapper />
				</Providers>
			</body>
		</html>
	);
}
