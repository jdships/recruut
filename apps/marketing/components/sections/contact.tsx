"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { Textarea } from "@workspace/ui/components/textarea";
import { MailIcon } from "lucide-react";
import type * as React from "react";
import { useState, useTransition } from "react";
import { GridSection } from "~/components/fragments/grid-section";
import { SiteHeading } from "~/components/fragments/site-heading";
import { sendContactMessage } from "../../app/actions/send-contact-message";

export function Contact(): React.JSX.Element {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!firstName.trim() ||
			!lastName.trim() ||
			!email.trim() ||
			!message.trim()
		) {
			toast.error("All fields are required.");
			return;
		}
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(email)) {
			toast.error("Please enter a valid email address.");
			return;
		}
		startTransition(async () => {
			const result = await sendContactMessage({
				firstName,
				lastName,
				email,
				message,
			});
			if (result.success) {
				toast.success("Message sent! We'll get back to you soon.");
				setFirstName("");
				setLastName("");
				setEmail("");
				setMessage("");
			} else {
				toast.error(result.message || "Failed to send message.");
			}
		});
	};
	return (
		<GridSection>
			<div className="container space-y-20 py-20 pt-30 max-w-5xl">
				<SiteHeading
					badge="Contact"
					title={
						<>
							We&apos;d love to hear
							<br /> from you!
						</>
					}
				/>
				<div className="relative z-10 mx-auto">
					<div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
						<div className="order-2 space-y-8 text-center lg:order-1 lg:w-1/2 lg:text-left">
							<h3 className="hidden max-w-fit text-4xl font-semibold lg:block">
								Get in touch
							</h3>
							<p className="text-muted-foreground lg:max-w-[80%]">
								If you have any questions, don't hesitate to contact our team.
								We'll get back to you within 48 hours.
							</p>
							<div className="space-y-4">
								<h4 className="hidden text-lg font-medium lg:block">
									Contact details
								</h4>
								<div className="flex flex-col items-center gap-3 lg:items-start">
									<ContactInfo icon={MailIcon} text="hello@recruut.io" />
								</div>
							</div>
						</div>
						<Card className="order-1 mx-auto w-full py-6 lg:py-10 max-w-lg shadow-lg lg:order-2 lg:w-1/2">
							<CardContent className="flex flex-col gap-6 px-6 lg:px-10">
								<form
									onSubmit={handleSendMessage}
									className="flex flex-col gap-6"
								>
									<div className="grid grid-cols-2 gap-4">
										<div className="col-span-2 grid w-full items-center gap-1.5 sm:col-span-1">
											<Label htmlFor="firstname">First Name</Label>
											<Input
												id="firstname"
												type="text"
												placeholder="John"
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
											/>
										</div>
										<div className="col-span-2 grid w-full items-center gap-1.5 sm:col-span-1">
											<Label htmlFor="lastname">Last Name</Label>
											<Input
												id="lastname"
												type="text"
												placeholder="Doe"
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
											/>
										</div>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="johndoe@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="grid w-full gap-1.5">
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											placeholder="Type your message here."
											rows={6}
											value={message}
											onChange={(e) => setMessage(e.target.value)}
										/>
									</div>
									<Button type="submit" className="w-full" disabled={isPending}>
										{isPending ? "Sending..." : "Send message"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</GridSection>
	);
}

type ContactInfoProps = {
	icon: React.ElementType;
	text: string;
};

function ContactInfo({
	icon: Icon,
	text,
}: ContactInfoProps): React.JSX.Element {
	return (
		<div className="flex items-center gap-2 text-sm lg:w-64">
			<Icon className="size-4 shrink-0 text-muted-foreground" />
			<span>{text}</span>
		</div>
	);
}
