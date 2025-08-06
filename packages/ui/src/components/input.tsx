import type * as React from "react";

import { cn } from "../lib/utils";

export type InputElement = React.ComponentRef<"input">;
export type InputProps = React.ComponentProps<"input">;
function Input({ className, type, ...props }: InputProps): React.JSX.Element {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground bg-card placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-primary focus-visible:ring-gray-300 dark:focus-visible:ring-primary/30 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				type === "search" &&
					"[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
				type === "file" &&
					"text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
