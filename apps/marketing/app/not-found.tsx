import type * as React from "react";

import { GridSection } from "~/components/fragments/grid-section";

export default function NotFound(): React.JSX.Element {
	return (
		<GridSection>
			<div className="flex flex-col py-32 items-center justify-center text-center min-h-screen">
				<span className="text-[10rem] font-semibold leading-none">404</span>
				<h2 className="font-heading my-2 text-2xl font-bold">
					Something&apos;s missing
				</h2>
				<p>
					Sorry, the page you are looking for doesn&apos;t exist or has been
					moved.
				</p>
			</div>
		</GridSection>
	);
}
