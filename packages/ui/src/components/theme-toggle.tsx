"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import type * as React from "react";

import { useTheme } from "../hooks/use-theme";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";

export type ThemeToggleElement = React.ComponentRef<typeof Button>;
export type ThemeToggleProps = React.ComponentPropsWithoutRef<typeof Button> &
	Omit<ButtonProps, "variant" | "size" | "onClick">;

function ThemeToggle({
	className,
	...props
}: ThemeToggleProps): React.JSX.Element {
	const { resolvedTheme, setTheme } = useTheme();
	const handleToggleTheme = (): void => {
		setTheme(resolvedTheme === "light" ? "dark" : "light");
	};
	return (
		<Button
			variant="outline"
			size="icon"
			onClick={handleToggleTheme}
			className={cn("bg-background", className)}
			{...props}
		>
			<SunIcon
				className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				aria-hidden="true"
			/>
			<MoonIcon
				className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				aria-hidden="true"
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
export { ThemeToggle };
