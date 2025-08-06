"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const SetupIllustration = ({ className }: { className?: string }) => {
	const items = [
		"Job Description",
		"Application Link",
		"AI Screening",
		"Candidate Data",
		"Shortlist",
	];

	const [scrollPosition, setScrollPosition] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const itemHeight = 40; // Height of each item in pixels
	const containerHeight = 180; // Height of the container
	const centerPosition = containerHeight / 2; // 90px - center of container

	// Create duplicated items for infinite scroll effect
	const duplicatedItems = [...items, ...items, ...items];

	useEffect(() => {
		const scrollTimer = setInterval(() => {
			setScrollPosition((prevPosition) => {
				const newPosition = prevPosition + itemHeight;
				// Reset position when we've scrolled through one full cycle
				if (newPosition >= items.length * itemHeight) {
					return 0;
				}
				return newPosition;
			});
		}, 2000); // Change every 2 seconds

		return () => clearInterval(scrollTimer);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Apply scroll position
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.style.transform = `translateY(-${scrollPosition}px)`;
		}
	}, [scrollPosition]);

	return (
		<div
			className={cn(
				"[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]",
				className,
			)}
		>
			<div className="mx-auto w-full max-w-xs font-mono text-lg font-medium min-h-[180px] bg-background relative">
				{/* Scrolling items container */}
				<div className="relative overflow-hidden h-[180px]">
					<div
						ref={containerRef}
						className="transition-transform duration-1000 ease-in-out"
					>
						{duplicatedItems.map((item, index) => {
							const actualIndex = index % items.length;

							// Calculate if this item is in the center position
							const itemPosition = index * itemHeight - scrollPosition;
							const distanceFromCenter = Math.abs(
								itemPosition - centerPosition,
							);
							const isActive = distanceFromCenter < itemHeight / 2; // Item is active if it's within half an item height of center

							return (
								<motion.div
									key={`${item}-${Math.floor(index / items.length)}-${actualIndex}`}
									className={cn(
										"flex items-center justify-center h-[40px] text-muted-foreground transition-colors duration-300 relative text-center",
										isActive && "text-foreground",
									)}
									animate={{
										opacity: isActive ? 1 : 0.6,
										scale: isActive ? 1.05 : 1,
									}}
									transition={{
										duration: 0.3,
										ease: "easeInOut",
									}}
								>
									<span className="px-4">{item}</span>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

// Example usage
export default function Component() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<SetupIllustration className="w-full max-w-5xl" />
		</div>
	);
}
