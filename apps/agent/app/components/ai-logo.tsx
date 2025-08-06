"use client";

import type * as React from "react";

export type LogoElement = React.ComponentRef<"div">;
export type LogoProps = React.ComponentPropsWithoutRef<"div"> & {
	hideSymbol?: boolean;
	hideWordmark?: boolean;
};
export function AiLogo(): React.JSX.Element {
	return (
		<div className="flex items-center justify-center">
			<div className="flex size-6 items-center justify-center text-primary dark:invert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="512"
					height="512"
					x="0"
					y="0"
					viewBox="0 0 24 24"
				>
					<title>AI Logo</title>
					<circle r="12" cx="12" cy="12" fill="#000000"></circle>
					<g transform="matrix(0.7,0,0,0.7,3.5999839425086986,3.4500160217285156)">
						<path
							fill="#ffffff"
							d="M12 1a1 1 0 0 1 1 1v4h1.2c1.669 0 2.748 0 3.654.294a6 6 0 0 1 3.852 3.852c.295.906.294 1.985.294 3.654v.4c0 1.669 0 2.748-.294 3.654a6 6 0 0 1-3.852 3.852c-.906.295-1.986.295-3.655.294H9.8c-1.669 0-2.748 0-3.654-.294a6 6 0 0 1-3.852-3.852C1.999 16.948 1.999 15.87 2 14.2v-.4c0-1.669 0-2.748.294-3.654a6 6 0 0 1 3.852-3.852C7.052 5.999 8.13 6 9.8 6H11V2a1 1 0 0 1 1-1zm-2 7c-1.94 0-2.672.012-3.236.196a4 4 0 0 0-2.568 2.568C4.012 11.329 4 12.06 4 14s.012 2.671.196 3.236a4 4 0 0 0 2.568 2.568C7.328 19.988 8.06 20 10 20h4c1.94 0 2.672-.012 3.236-.196a4 4 0 0 0 2.568-2.568C19.988 16.671 20 15.94 20 14s-.012-2.671-.196-3.236a4 4 0 0 0-2.568-2.568C16.671 8.012 15.939 8 14 8zm-3 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm6 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
							fillRule="evenodd"
							clipRule="evenodd"
							opacity="1"
						></path>
					</g>
				</svg>
			</div>
		</div>
	);
}
