"use client";

import { useCallback, useState } from "react";

export function useHover() {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	return {
		isHovered,
		handleMouseEnter,
		handleMouseLeave,
	};
}
