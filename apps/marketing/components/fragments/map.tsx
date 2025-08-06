"use client";
import DottedMap from "dotted-map";

const map = new DottedMap({ height: 55, grid: "vertical" });

const points = map.getPoints();

const svgOptions = {
	backgroundColor: "var(--color-background)",
	color: "currentColor",
	radius: 0.15,
};

export const Map = () => {
	const viewBox = `0 0 120 60`;
	return (
		<svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
			{points.map((point, index) => (
				<circle
					key={index}
					cx={point.x}
					cy={point.y}
					r={svgOptions.radius}
					fill={svgOptions.color}
				/>
			))}
			<title>Map</title>
		</svg>
	);
};
