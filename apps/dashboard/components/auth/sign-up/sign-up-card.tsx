"use client";

import { routes } from "@workspace/routes";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import {
	GoogleIcon,
	MicrosoftIcon,
} from "@workspace/ui/components/brand-icons";
import { Button } from "@workspace/ui/components/button";
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
import { cn } from "@workspace/ui/lib/utils";
import { AlertCircleIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import type { SubmitHandler } from "react-hook-form";

import { continueWithGoogle } from "~/actions/auth/continue-with-google";
import { continueWithMicrosoft } from "~/actions/auth/continue-with-microsoft";
import { signUp } from "~/actions/auth/sign-up";
import { OrContinueWith } from "~/components/auth/or-continue-with";
import { PasswordFormMessage } from "~/components/auth/password-form-message";
import { useZodForm } from "~/hooks/use-zod-form";
import { type SignUpSchema, signUpSchema } from "~/schemas/auth/sign-up-schema";

export function SignUpCard({
	className,
	...other
}: CardProps): React.JSX.Element {
	const [errorMessage, setErrorMessage] = React.useState<string>();
	const methods = useZodForm({
		schema: signUpSchema,
		mode: "onSubmit",
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});
	const password = methods.watch("password");
	const onSubmit: SubmitHandler<SignUpSchema> = async (values) => {
		const result = await signUp(values);
		if (result?.serverError || result?.validationErrors) {
			if (result.validationErrors?.email?._errors?.[0]) {
				setErrorMessage(result.validationErrors?.email?._errors?.[0]);
			} else {
				setErrorMessage("An error occured during sign up.");
			}
		}
	};
	const handleSignInWithGoogle = async (): Promise<void> => {
		const result = await continueWithGoogle();
		if (result?.serverError || result?.validationErrors) {
			setErrorMessage("An error occured during Google sign up.");
		}
	};
	const handleSignInWithMicrosoft = async (): Promise<void> => {
		const result = await continueWithMicrosoft();
		if (result?.serverError || result?.validationErrors) {
			setErrorMessage("An error occured during Microsoft sign up.");
		}
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
					Create your account
				</CardTitle>
				<CardDescription>
					Please fill in the details to get started.
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
							name="name"
							render={({ field }) => (
								<FormItem className="flex w-full flex-col">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<InputWithAdornments
											type="text"
											maxLength={64}
											autoComplete="name"
											disabled={methods.formState.isSubmitting}
											startAdornment={<UserIcon className="size-4 shrink-0" />}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex w-full flex-col">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<InputWithAdornments
											type="email"
											maxLength={255}
											autoComplete="username"
											disabled={methods.formState.isSubmitting}
											startAdornment={<MailIcon className="size-4 shrink-0" />}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-col">
							<FormField
								control={methods.control}
								name="password"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Password</FormLabel>
										<FormControl>
											<InputPassword
												maxLength={72}
												autoCapitalize="off"
												autoComplete="current-password"
												disabled={methods.formState.isSubmitting}
												startAdornment={
													<LockIcon className="size-4 shrink-0" />
												}
												{...field}
											/>
										</FormControl>
										<PasswordFormMessage password={password} />
									</FormItem>
								)}
							/>
						</div>
						{errorMessage && (
							<Alert variant="destructive">
								<AlertCircleIcon className="size-[18px] shrink-0" />
								<AlertDescription className="inline">
									{errorMessage}
								</AlertDescription>
							</Alert>
						)}
						<Button
							type="submit"
							className="w-full"
							disabled={methods.formState.isSubmitting}
							loading={methods.formState.isSubmitting}
						>
							Create account
						</Button>
					</form>
				</FormProvider>
				<OrContinueWith />
				<div className="flex gap-4">
					<Button
						type="button"
						variant="outline"
						className="flex flex-1 items-center gap-2"
						disabled={methods.formState.isSubmitting}
						onClick={handleSignInWithGoogle}
					>
						<GoogleIcon width="20" height="20" />
						Google
					</Button>
					<Button
						type="button"
						variant="outline"
						className="flex flex-1 items-center gap-2"
						disabled={methods.formState.isSubmitting}
						onClick={handleSignInWithMicrosoft}
					>
						<MicrosoftIcon width="20" height="20" />
						Microsoft
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex justify-center gap-1 text-sm text-muted-foreground">
				<span>Already have an account?</span>
				<Link
					href={routes.dashboard.auth.SignIn}
					className="text-foreground underline"
				>
					Sign in
				</Link>
			</CardFooter>
		</Card>
	);
}
