import withBundleAnalyzer from "@next/bundle-analyzer";
import { MonitoringProvider } from "@workspace/monitoring/provider";
import type { NextConfig } from "next/types";
import { createSecureHeaders } from "next-secure-headers";

const INTERNAL_PACKAGES = [
	"@workspace/auth",
	"@workspace/billing",
	"@workspace/common",
	"@workspace/database",
	"@workspace/email",
	"@workspace/monitoring",
	"@workspace/rate-limit",
	"@workspace/routes",
	"@workspace/ui",
	"@workspace/webhooks",
];

const nextConfig: NextConfig = {
	/** Enables hot reloading for local packages without a build step */
	transpilePackages: INTERNAL_PACKAGES,
	serverExternalPackages: [],
	productionBrowserSourceMaps: false,
	experimental: {
		optimizePackageImports: [
			"recharts",
			"lucide-react",
			"date-fns",
			...INTERNAL_PACKAGES,
		],
	},
	reactStrictMode: true,
	poweredByHeader: false,
	devIndicators: false,
	async headers() {
		return [
			{
				locale: false,
				source: "/(.*)",
				headers: createSecureHeaders({
					frameGuard: "deny",
					noopen: "noopen",
					nosniff: "nosniff",
					xssProtection: "sanitize",
					forceHTTPSRedirect: [
						true,
						{ maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
					],
					referrerPolicy: "same-origin",
				}),
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/auth",
				permanent: false,
			},
			{
				source: "/auth",
				destination: "/auth/sign-in",
				permanent: false,
			},
			{
				source: "/organizations/:slug/settings",
				destination: "/organizations/:slug/settings/account",
				permanent: false,
			},
			{
				source: "/organizations/:slug/settings/account",
				destination: "/organizations/:slug/settings/account/profile",
				permanent: false,
			},
			{
				source: "/organizations/:slug/settings/organization",
				destination: "/organizations/:slug/settings/organization/general",
				permanent: false,
			},
		];
	},
};

const bundleAnalyzerConfig =
	process.env.ANALYZE === "true"
		? withBundleAnalyzer({ enabled: true })(nextConfig)
		: nextConfig;

export default MonitoringProvider.withConfig(bundleAnalyzerConfig);
