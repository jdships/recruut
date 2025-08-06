"use client";

import NiceModal from "@ebay/nice-modal-react";

import { AnalyticsProvider } from "@workspace/analytics/hooks/use-analytics";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { ThemeProvider } from "@workspace/ui/hooks/use-theme";
import type * as React from "react";

export function Providers({
	children,
}: React.PropsWithChildren): React.JSX.Element {
	return (
		<AnalyticsProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<TooltipProvider>
					<NiceModal.Provider>{children}</NiceModal.Provider>
				</TooltipProvider>
			</ThemeProvider>
		</AnalyticsProvider>
	);
}
