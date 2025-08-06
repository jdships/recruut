"use client";

import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@workspace/ui/components/dialog";
import { WaitlistForm } from "./waitlist-form";

interface WaitlistButtonProps {
	children: React.ReactNode;
	size?: "sm" | "lg" | "default";
	variant?: "default" | "ghost" | "outline";
	className?: string;
	showNameFields?: boolean;
}

export function WaitlistButton({
	children,
	size = "default",
	variant = "default",
	className = "",
	showNameFields = false,
}: WaitlistButtonProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={size} variant={variant} className={className}>
					{children}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Join the Waitlist</DialogTitle>
					<DialogDescription>
						Be among the first to experience the future of AI-powered
						recruiting. We'll notify you when Recruut launches with exclusive
						early access.
					</DialogDescription>
				</DialogHeader>
				<WaitlistForm showNameFields={showNameFields} />
			</DialogContent>
		</Dialog>
	);
}
