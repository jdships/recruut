"use client";

import type * as React from "react";
import { BannerWithUpgradeModal } from "~/components/organizations/slug/home/banner-with-upgrade-modal";
import { HomeSpinner } from "~/components/organizations/slug/home/home-spinner";
import { useTransitionContext } from "~/hooks/use-transition-context";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export function HomeContent({
	leadGeneration,
	topOpportunities,
	topCandidates,
	profile,
}: {
	leadGeneration: React.ReactNode;
	topOpportunities: React.ReactNode;
	topCandidates: React.ReactNode;
	profile: ProfileDto;
}) {
	const { isLoading } = useTransitionContext();

	// Calculate expiry: 72h after emailVerified
	let isBannerExpired = true;
	let expiry: Date | null = null;
	if (profile.emailVerified) {
		expiry = new Date(
			new Date(profile.emailVerified).getTime() + 72 * 60 * 60 * 1000,
		);
		isBannerExpired = new Date() > expiry;
	}

	return (
		<div className="relative">
			<div
				className={
					isLoading
						? "opacity-50 pointer-events-none transition-opacity"
						: "transition-opacity"
				}
			>
				<div className="mx-auto max-w-6xl space-y-2 p-2 sm:space-y-8 sm:p-6">
					{profile.isOwner && !isBannerExpired && (
						<BannerWithUpgradeModal expiry={expiry} />
					)}
					{leadGeneration}
					<div className="grid grid-cols-1 gap-2 sm:gap-8 md:grid-cols-2">
						{topOpportunities}
						{topCandidates}
					</div>
				</div>
			</div>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center z-50">
					<HomeSpinner />
				</div>
			)}
		</div>
	);
}
