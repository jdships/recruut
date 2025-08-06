import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import "@workspace/ui/globals.css";
import "./agent-specific.css";
import CrispWrapper from "../components/crisp-wrapper";

const APP_NAME = "Recruut";
const APP_DESCRIPTION = "AI-powered recruiting platform";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export const metadata: Metadata = {
	title: APP_NAME,
	description: APP_DESCRIPTION,
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: APP_NAME,
		title: APP_NAME,
		description: APP_DESCRIPTION,
		images: {
			url: "/og-image.png",
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

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<CrispWrapper />
				</ThemeProvider>
			</body>
		</html>
	);
}
