import type * as React from "react";

import { cn } from "../lib/utils";

export type TextareaElement = React.ComponentRef<"textarea">;
export type TextareaProps = React.ComponentProps<"textarea">;
function Textarea({ className, ...props }: TextareaProps): React.JSX.Element {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"border-input placeholder:text-muted-foreground bg-card dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-primary focus-visible:ring-gray-300 dark:focus-visible:ring-primary/30 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
