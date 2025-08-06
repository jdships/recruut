"use client";

import { useEffect, useState } from "react";

type UseGithubStarsOptions = {
	/** Fallback star count if fetch fails */
	fallbackStars?: number;
	/** Cache duration in milliseconds (default: 5 minutes) */
	cacheDuration?: number;
};

export function useGithubStars(
	repoUrl: string,
	options: UseGithubStarsOptions = {},
) {
	const { fallbackStars = 0, cacheDuration = 5 * 60 * 1000 } = options;

	const [stars, setStars] = useState(fallbackStars);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!repoUrl) {
			setStars(fallbackStars);
			setIsLoading(false);
			return;
		}

		const fetchStars = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Extract owner/repo from GitHub URL
				const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
				if (!match) {
					throw new Error("Invalid GitHub URL format");
				}

				const [, owner, repo] = match;
				const cacheKey = `github-stars-${owner}-${repo}`;

				// Check cache first
				const cached = localStorage.getItem(cacheKey);
				if (cached) {
					const { data, timestamp } = JSON.parse(cached);
					if (Date.now() - timestamp < cacheDuration) {
						setStars(data);
						setIsLoading(false);
						return;
					}
				}

				// Fetch from GitHub API
				const response = await fetch(
					`https://api.github.com/repos/${owner}/${repo}`,
					{
						headers: {
							Accept: "application/vnd.github.v3+json",
						},
					},
				);

				if (!response.ok) {
					if (response.status === 404) {
						throw new Error("Repository not found or is private");
					}
					if (response.status === 403) {
						throw new Error("GitHub API rate limit exceeded");
					}
					throw new Error(`GitHub API error: ${response.status}`);
				}

				const data = await response.json();
				const starCount = data.stargazers_count || 0;

				// Cache the result
				localStorage.setItem(
					cacheKey,
					JSON.stringify({
						data: starCount,
						timestamp: Date.now(),
					}),
				);

				setStars(starCount);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to fetch stars";
				setError(errorMessage);
				setStars(fallbackStars);

				// Log error for debugging (only in development)
				if (process.env.NODE_ENV === "development") {
					console.warn(
						`GitHub stars fetch failed for ${repoUrl}:`,
						errorMessage,
					);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchStars();
	}, [repoUrl, fallbackStars, cacheDuration]);

	return {
		stars,
		isLoading,
		error,
	};
}
