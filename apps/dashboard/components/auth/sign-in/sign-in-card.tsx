"use client";

import { AuthErrorCode } from "@workspace/auth/errors";
import { routes } from "@workspace/routes";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import {
	GoogleIcon,
	MicrosoftIcon,
} from "@workspace/ui/components/brand-icons";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	type CardProps,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormProvider,
} from "@workspace/ui/components/form";
import { InputPassword } from "@workspace/ui/components/input-password";
import { InputWithAdornments } from "@workspace/ui/components/input-with-adornments";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import {
	AlertCircleIcon,
	ArrowRightIcon,
	LockIcon,
	MailIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { continueWithGoogle } from "~/actions/auth/continue-with-google";
import { continueWithMicrosoft } from "~/actions/auth/continue-with-microsoft";
import { signInWithCredentials } from "~/actions/auth/sign-in-with-credentials";
import { OrContinueWith } from "~/components/auth/or-continue-with";
import { useZodForm } from "~/hooks/use-zod-form";
import { authErrorLabels } from "~/lib/labels";
import {
	type PassThroughCredentialsSchema,
	passThroughCredentialsSchema,
} from "~/schemas/auth/pass-through-credentials-schema";

export function SignInCard({
	className,
	...other
}: CardProps): React.JSX.Element {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [errorMessage, setErrorMessage] = React.useState<string>();
	const [unverifiedEmail, setUnverifiedEmail] = React.useState<
		string | undefined
	>();
	const methods = useZodForm({
		// We pass through the values and do not validate on the client-side
		// Reason: Would be bad UX to validate fields, unexpected behavior at this spot
		schema: passThroughCredentialsSchema,
		mode: "onSubmit",
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const canSubmit = !isLoading && !methods.formState.isSubmitting;
	const onSubmit = async (
		values: PassThroughCredentialsSchema,
	): Promise<void> => {
		if (!canSubmit) {
			return;
		}
		setIsLoading(true);
		const result = await signInWithCredentials(values);

		if (result?.validationErrors?._errors) {
			const errorCode = result.validationErrors._errors[0] as AuthErrorCode;

			setUnverifiedEmail(
				errorCode === AuthErrorCode.UnverifiedEmail ? values.email : undefined,
			);
			setErrorMessage(
				authErrorLabels[
					errorCode in authErrorLabels ? errorCode : AuthErrorCode.UnknownError
				],
			);

			setIsLoading(false);
		} else if (result?.serverError) {
			setUnverifiedEmail(undefined);
			setErrorMessage(result.serverError);
			setIsLoading(false);
		}
	};
	const handleSignInWithGoogle = async (): Promise<void> => {
		if (!canSubmit) {
			return;
		}
		setIsLoading(true);
		const result = await continueWithGoogle();
		if (result?.serverError || result?.validationErrors) {
			toast.error("Couldn't continue with Google");
		}
		setIsLoading(false);
	};
	const handleSignInWithMicrosoft = async (): Promise<void> => {
		if (!canSubmit) {
			return;
		}
		setIsLoading(true);
		const result = await continueWithMicrosoft();
		if (result?.serverError || result?.validationErrors) {
			toast.error("Couldn't continue with Google");
		}
		setIsLoading(false);
	};
	return (
		<Card
			className={cn(
				"w-full px-4 py-8 border-border dark:border-border",
				className,
			)}
			{...other}
		>
			<CardHeader>
				<CardTitle className="text-base lg:text-lg">
					Sign in to your account
				</CardTitle>
				<CardDescription>
					Welcome back! Please sign in to continue.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<FormProvider {...methods}>
					<form
						className="flex flex-col gap-4"
						onSubmit={methods.handleSubmit(onSubmit)}
					>
						<FormField
							control={methods.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<InputWithAdornments
											{...field}
											type="email"
											maxLength={255}
											autoCapitalize="off"
											autoComplete="username"
											startAdornment={<MailIcon className="size-4 shrink-0" />}
											disabled={methods.formState.isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="password"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<div className="flex flex-row items-center justify-between">
										<FormLabel>Password</FormLabel>
										<Link
											href={routes.dashboard.auth.forgetPassword.Index}
											className="ml-auto inline-block text-sm underline"
										>
											Forgot password?
										</Link>
									</div>
									<FormControl>
										<InputPassword
											{...field}
											maxLength={72}
											autoCapitalize="off"
											autoComplete="current-password"
											startAdornment={<LockIcon className="size-4 shrink-0" />}
											disabled={methods.formState.isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{errorMessage && (
							<Alert variant="destructive">
								<AlertCircleIcon className="size-[18px] shrink-0" />
								<AlertDescription className="inline">
									{errorMessage}
									{unverifiedEmail && (
										<Link
											href={`${routes.dashboard.auth.verifyEmail.Index}?email=${encodeURIComponent(unverifiedEmail)}`}
											className={cn(
												buttonVariants({ variant: "link" }),
												"ml-0.5 h-fit gap-0.5 px-0.5 py-0 text-foreground underline",
											)}
										>
											Verify email
											<ArrowRightIcon className="size-3 shrink-0" />
										</Link>
									)}
								</AlertDescription>
							</Alert>
						)}
						<Button
							type="submit"
							variant="default"
							className="w-full relative"
							disabled={!canSubmit}
							loading={methods.formState.isSubmitting}
							onClick={methods.handleSubmit(onSubmit)}
						>
							Sign in
						</Button>
					</form>
				</FormProvider>
				<OrContinueWith />
				<div className="flex gap-4">
					<Button
						type="button"
						variant="outline"
						className="flex flex-1 items-center gap-2"
						disabled={!canSubmit}
						onClick={handleSignInWithGoogle}
					>
						<GoogleIcon width="20" height="20" />
						Google
					</Button>
					<Button
						type="button"
						variant="outline"
						className="flex flex-1 items-center gap-2"
						disabled={!canSubmit}
						onClick={handleSignInWithMicrosoft}
					>
						<MicrosoftIcon width="20" height="20" />
						Microsoft
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex justify-center gap-1 text-sm text-muted-foreground">
				<span>Don't have an account?</span>
				<Link
					href={routes.dashboard.auth.SignUp}
					className="text-foreground underline"
				>
					Sign up
				</Link>
			</CardFooter>
		</Card>
	);
}
