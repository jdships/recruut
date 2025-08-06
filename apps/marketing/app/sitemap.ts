import fs from "fs/promises";
import path from "path";

import { env } from "~/env";

type SitemapEntry = {
	url: string;
	lastModified: Date | string;
	changeFreq?: string;
	priority?: number;
};

async function getPages(baseUrl: string): Promise<SitemapEntry[]> {
	const marketingPath = path.join(process.cwd(), "app");
	const entries = await fs.readdir(marketingPath, { withFileTypes: true });
	const routes: SitemapEntry[] = [];

	for (const entry of entries.filter((e) => e.isDirectory())) {
		// Check for page.tsx in the directory
		try {
			const fullPath = path.join(marketingPath, entry.name);
			const pageStats = await fs.stat(path.join(fullPath, "page.tsx"));
			const route = entry.name === "home" ? "" : entry.name;

			routes.push({
				url: `${baseUrl}/${route}`,
				lastModified: pageStats.mtime,
				priority: route === "" ? 1.0 : 0.8,
				changeFreq: "weekly",
			});
		} catch {
			// No page.tsx found, skip this directory
		}
	}

	return routes;
}

export default async function Sitemap(): Promise<SitemapEntry[]> {
	const baseUrl = env.NEXT_PUBLIC_MARKETING_URL;
	const pages = await getPages(baseUrl);

	const sitemap: SitemapEntry[] = [
		{
			url: `${baseUrl}/`,
			lastModified: new Date(),
			priority: 1,
			changeFreq: "weekly",
		},
		...pages,
	];

	// Sort alphabetically by URL
	return sitemap.sort((a, b) => a.url.localeCompare(b.url));
}
