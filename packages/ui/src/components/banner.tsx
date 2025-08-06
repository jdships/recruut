"use client";

import { ClockFadingIcon, GiftIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
// Import UpgradePlanDialog from dashboard billing (relative import for monorepo)
import { Button } from "./button";

export interface BannerProps {
	onClaimOffer?: () => void;
	expiry?: Date | null;
}

const BANNER_DISMISS_KEY = "bannerDismissedAt";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function Banner({ onClaimOffer, expiry }: BannerProps) {
	const [isVisible, setIsVisible] = useState(true);
	const [timeLeft, setTimeLeft] = useState<{
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	} | null>(null);

	// Check localStorage for dismissal
	useEffect(() => {
		if (typeof window === "undefined") return;
		const dismissedAt = localStorage.getItem(BANNER_DISMISS_KEY);
		if (dismissedAt) {
			const dismissedTime = new Date(dismissedAt).getTime();
			if (Date.now() - dismissedTime < DISMISS_DURATION_MS) {
				setIsVisible(false);
			}
		}
	}, []);

	// Countdown timer for display only
	useEffect(() => {
		if (!expiry) return;
		const updateTimer = () => {
			const now = new Date();
			const diff = expiry.getTime() - now.getTime();
			if (diff <= 0) {
				setTimeLeft(null);
				return;
			}
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
			);
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
			setTimeLeft({ days, hours, minutes, seconds });
		};
		updateTimer();
		const timer = setInterval(updateTimer, 1000);
		return () => clearInterval(timer);
	}, [expiry]);

	const handleClose = () => {
		setIsVisible(false);
		if (typeof window !== "undefined") {
			localStorage.setItem(BANNER_DISMISS_KEY, new Date().toISOString());
		}
	};

	if (!isVisible) return null;

	return (
		<div className="border text-foreground px-4 py-3 rounded-md bg-card">
			<div className="flex gap-2 md:items-center">
				<div className="flex grow gap-3 md:items-center">
					<div
						className="bg-sidebar-accent/50 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5 border border-border"
						aria-hidden="true"
					>
						<ClockFadingIcon className="opacity-80 " size={20} />
					</div>
					<div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
						<div className="space-y-0.5">
							<p className="text-sm">Limited Time Offer!</p>
							<p className="text-muted-foreground text-xs">
								Try Recruut completely for free for 7 days.
							</p>
						</div>
						<div className="flex gap-3 max-md:flex-wrap">
							{expiry && timeLeft && (
								<div className="divide-border border border-border bg-sidebar-accent/50  flex items-center divide-x rounded-lg text-sm tabular-nums h-8">
									{timeLeft.days > 0 && (
										<span className="flex h-8 items-center justify-center p-2">
											{timeLeft.days}
											<span className="text-muted-foreground">d</span>
										</span>
									)}
									<span className="flex h-8 items-center justify-center p-2">
										{timeLeft.hours.toString().padStart(2, "0")}
										<span className="text-muted-foreground">h</span>
									</span>
									<span className="flex h-8 items-center justify-center p-2">
										{timeLeft.minutes.toString().padStart(2, "0")}
										<span className="text-muted-foreground">m</span>
									</span>
									<span className="flex h-8 items-center justify-center p-2">
										{timeLeft.seconds.toString().padStart(2, "0")}
										<span className="text-muted-foreground">s</span>
									</span>
								</div>
							)}
							<Button variant="outline" size="sm" onClick={onClaimOffer}>
								<GiftIcon className="!size-4" />
								Claim Free Trial
							</Button>
						</div>
					</div>
				</div>
				<Button
					variant="ghost"
					className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
					onClick={handleClose}
					aria-label="Close banner"
				>
					<XIcon
						size={16}
						className="opacity-60 transition-opacity group-hover:opacity-100"
						aria-hidden="true"
					/>
				</Button>
			</div>
		</div>
	);
}
