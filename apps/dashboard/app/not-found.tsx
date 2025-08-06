"use client";

import { routes } from "@workspace/routes";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import type * as React from "react";

export default function NotFound(): React.JSX.Element {
	const router = useRouter();
	const handleGoBack = (): void => {
		router.back();
	};
	const handleBackToHome = (): void => {
		router.push(routes.dashboard.Index);
	};
	return (
		<div className="flex flex-col py-32 items-center justify-center text-center">
			<span className="text-[10rem] font-semibold leading-none">404</span>
			<h2 className="font-heading my-2 text-2xl font-bold">
				Something&apos;s missing
			</h2>
			<p>
				Sorry, the page you are looking for doesn&apos;t exist or has been
				moved.
			</p>
			<div className="mt-8 flex justify-center gap-2">
				<Button
					type="button"
					variant="default"
					size="lg"
					onClick={handleGoBack}
				>
					Go back
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="lg"
					onClick={handleBackToHome}
				>
					Back to Home
				</Button>
			</div>
		</div>
	);
}
