"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "../../lib/utils";

export interface CircleHelpIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CircleHelpIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
	isHovered?: boolean;
}

const variants: Variants = {
	normal: { rotate: 0 },
	animate: { rotate: [0, -10, 10, -10, 0] },
};

const CircleHelpIcon = forwardRef<CircleHelpIconHandle, CircleHelpIconProps>(
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

		// Control animation based on external isHovered prop
		useEffect(() => {
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
					<title>Help</title>
					<circle cx="12" cy="12" r="10" />
					<motion.g
						variants={variants}
						transition={{
							duration: 0.5,
							ease: "easeInOut",
						}}
						animate={controls}
					>
						<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
						<path d="M12 17h.01" />
					</motion.g>
				</svg>
			</div>
		);
	},
);

CircleHelpIcon.displayName = "CircleHelpIcon";

export { CircleHelpIcon };
