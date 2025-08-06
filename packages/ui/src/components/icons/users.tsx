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

export interface UsersIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UsersIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
	isHovered?: boolean;
}

const pathVariants: Variants = {
	normal: {
		x: 0,
		transition: {
			type: "spring",
			stiffness: 200,
			damping: 13,
		},
	},
	animate: {
		x: [-6, 0],
		transition: {
			delay: 0.1,
			type: "spring",
			stiffness: 200,
			damping: 13,
		},
	},
};

const UsersIcon = forwardRef<UsersIconHandle, UsersIconProps>(
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
					<title>Users</title>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<motion.path
						d="M22 21v-2a4 4 0 0 0-3-3.87"
						variants={pathVariants}
						animate={controls}
					/>
					<motion.path
						d="M16 3.13a4 4 0 0 1 0 7.75"
						variants={pathVariants}
						animate={controls}
					/>
				</svg>
			</div>
		);
	},
);

UsersIcon.displayName = "UsersIcon";

export { UsersIcon };
