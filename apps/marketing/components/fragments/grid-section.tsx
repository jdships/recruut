import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

export type GridSectionProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
	hideVerticalGridLines?: boolean;
	hideBottomGridLine?: boolean;
	containerProps?: React.HtmlHTMLAttributes<HTMLDivElement>;
};

export function GridSection({
	children,
	hideVerticalGridLines,
	hideBottomGridLine,
	containerProps: { className = "", ...containerProps } = {},
	...other
}: GridSectionProps): React.JSX.Element {
	return (
		<section {...other}>
			<div className={cn("px-2", className)} {...containerProps}>
				<div className="relative grid">
					{!hideVerticalGridLines && (
						<>
							<div className="absolute inset-y-0 block w-px bg-background" />
							<div className="absolute inset-y-0 right-0 w-px bg-background" />
						</>
					)}
					{children}
				</div>
			</div>
			{!hideBottomGridLine && <div className="h-px w-full bg-background" />}
		</section>
	);
}
