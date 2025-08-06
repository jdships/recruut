"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { Loader2, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	subscribeWaitlist,
	type WaitlistFormData,
} from "~/app/actions/subscribe-waitlist";

const waitlistSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	firstName: z.string().min(1, "First name is required").optional(),
	lastName: z.string().min(1, "Last name is required").optional(),
});

interface WaitlistFormProps {
	variant?: "default" | "compact";
	className?: string;
	showNameFields?: boolean;
}

export function WaitlistForm({
	variant = "default",
	className = "",
	showNameFields = false,
}: WaitlistFormProps) {
	const [isPending, startTransition] = useTransition();
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<WaitlistFormData>({
		resolver: zodResolver(waitlistSchema),
	});

	const onSubmit = (data: WaitlistFormData) => {
		startTransition(async () => {
			try {
				const result = await subscribeWaitlist(data);

				if (result.success) {
					setIsSubmitted(true);
					reset();
					toast.success("Success!", {
						description: result.message,
					});
				} else {
					toast.error("Error", {
						description: result.message,
					});
				}
			} catch {
				toast.error("Error", {
					description: "Something went wrong. Please try again.",
				});
			}
		});
	};

	if (isSubmitted) {
		return (
			<div className={`text-center space-y-4 ${className}`}>
				<div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
					<div className="flex items-center justify-center space-x-2 text-green-500 dark:text-green-400">
						<Mail className="h-5 w-5" />
						<p className="font-medium">You're on the list!</p>
					</div>
					<p className="mt-2 text-sm text-green-500 dark:text-green-300 text-center">
						Check your email for confirmation and next steps.
					</p>
				</div>
			</div>
		);
	}

	if (variant === "compact") {
		return (
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={`space-y-3 ${className}`}
			>
				<div className="flex flex-col gap-2 sm:flex-row">
					<div className="flex-1">
						<Input
							{...register("email")}
							type="email"
							placeholder="Enter your email"
							className="w-full h-10"
							disabled={isPending}
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-400">
								{errors.email.message}
							</p>
						)}
					</div>
					<Button
						type="submit"
						disabled={isPending}
						size="lg"
						className="w-full sm:w-auto px-6"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Joining...
							</>
						) : (
							"Request Access"
						)}
					</Button>
				</div>
			</form>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={`space-y-4 ${className}`}
		>
			{showNameFields && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<Label htmlFor="firstName">First Name</Label>
						<Input
							{...register("firstName")}
							id="firstName"
							placeholder="Enter your first name"
							disabled={isPending}
						/>
						{errors.firstName && (
							<p className="mt-1 text-sm text-red-400">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div>
						<Label htmlFor="lastName">Last Name</Label>
						<Input
							{...register("lastName")}
							id="lastName"
							placeholder="Enter your last name"
							disabled={isPending}
						/>
						{errors.lastName && (
							<p className="mt-1 text-sm text-red-400">
								{errors.lastName.message}
							</p>
						)}
					</div>
				</div>
			)}

			<div>
				<Label htmlFor="email">Email Address</Label>
				<Input
					{...register("email")}
					id="email"
					type="email"
					placeholder="Enter your email address"
					disabled={isPending}
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
				)}
			</div>

			<Button type="submit" disabled={isPending} size="lg" className="w-full">
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Requesting Access...
					</>
				) : (
					"Request Access"
				)}
			</Button>

			<p className="text-xs text-muted-foreground text-center">
				We'll only send you updates about our launch. No spam, ever.
			</p>
		</form>
	);
}
