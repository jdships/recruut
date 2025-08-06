"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "../../lib/utils";

export interface SearchIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SearchIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
	isHovered?: boolean;
}

const SearchIcon = forwardRef<SearchIconHandle, SearchIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 16, isHovered, ...props },
		ref,
	) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		// Handle external hover control
		React.useEffect(() => {
			if (isHovered !== undefined) {
				controls.start(isHovered ? "animate" : "normal");
			}
		}, [isHovered, controls]);

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current && isHovered === undefined) {
					controls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[controls, onMouseEnter, isHovered],
		);

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current && isHovered === undefined) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[controls, onMouseLeave, isHovered],
		);

		return (
			<div
				className={cn(className)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					variants={{
						normal: { x: 0, y: 0 },
						animate: {
							x: [0, 0, -3, 0],
							y: [0, -4, 0, 0],
						},
					}}
					transition={{
						duration: 1,
						bounce: 0.3,
					}}
					animate={controls}
				>
					<title>Search</title>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</motion.svg>
			</div>
		);
	},
);

SearchIcon.displayName = "SearchIcon";

export { SearchIcon };
