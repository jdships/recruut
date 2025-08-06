"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "../../lib/utils";

export interface CopyIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CopyIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
	isHovered?: boolean;
}

const defaultTransition: Transition = {
	type: "spring",
	stiffness: 160,
	damping: 17,
	mass: 1,
};

const CopyIcon = forwardRef<CopyIconHandle, CopyIconProps>(
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Copy</title>
					<motion.rect
						width="14"
						height="14"
						x="8"
						y="8"
						rx="2"
						ry="2"
						variants={{
							normal: { y: 0, x: 0 },
							animate: { y: -3, x: -3 },
						}}
						animate={controls}
						transition={defaultTransition}
					/>
					<motion.path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
						variants={{
							normal: { x: 0, y: 0 },
							animate: { x: 3, y: 3 },
						}}
						transition={defaultTransition}
						animate={controls}
					/>
				</svg>
			</div>
		);
	},
);

CopyIcon.displayName = "CopyIcon";

export { CopyIcon };
