import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next/types";
import { createSecureHeaders } from "next-secure-headers";

const INTERNAL_PACKAGES = [
	"@workspace/common",
	"@workspace/routes",
	"@workspace/ui",
];

const nextConfig: NextConfig = {
	/** Enables hot reloading for local packages without a build step */
	transpilePackages: INTERNAL_PACKAGES,
	serverExternalPackages: [],

	experimental: {
		optimizePackageImports: [
			"recharts",
			"lucide-react",
			"date-fns",
			...INTERNAL_PACKAGES,
		],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "randomuser.me",
				port: "",
				pathname: "**",
				search: "",
			},
		],
	},
	reactStrictMode: true,
	poweredByHeader: false,
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
};

const bundleAnalyzerConfig =
	process.env.ANALYZE === "true"
		? withBundleAnalyzer({ enabled: true })(nextConfig)
		: nextConfig;

export default bundleAnalyzerConfig;
