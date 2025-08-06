import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { AlertCircleIcon, BookIcon, ScaleIcon } from "lucide-react";
import type * as React from "react";

import { GridSection } from "~/components/fragments/grid-section";
import { SiteHeading } from "~/components/fragments/site-heading";

const DATA_CARDS = [
	{
		title: "Introduction",
		icon: <BookIcon className="size-4 shrink-0" />,
		content:
			"This Privacy Policy explains how we collect, use, and protect your personal data when you interact with our platform.",
	},
	{
		title: "Information Collection",
		icon: <ScaleIcon className="size-4 shrink-0" />,
		content:
			"We collect information that you provide directly to us, such as when you sign up or interact with our services.",
	},
	{
		title: "Data Usage",
		icon: <AlertCircleIcon className="size-4 shrink-0" />,
		content:
			"We use your data to provide, personalize, and improve your experience on our platform, including marketing and support.",
	},
];

const DATA_ACCORDION = [
	{
		title: "How We Protect Your Data",
		content:
			"We implement various security measures, including encryption and secure storage, to protect your personal information.",
	},
	{
		title: "Third-Party Sharing",
		content:
			"We may share your data with trusted third-party service providers for essential operations like payment processing or analytics.",
	},
	{
		title: "User Rights",
		content:
			"You have the right to access, update, or delete your personal data at any time. You can also opt-out of marketing communications.",
	},
	{
		title: "Cookies and Tracking",
		content:
			"We use cookies and similar technologies to personalize your experience and analyze usage patterns on our site.",
	},
	{
		title: "Changes to This Policy",
		content:
			"We may update this Privacy Policy from time to time. Changes will be posted here, and continued use of the platform constitutes acceptance.",
	},
];

export function PrivacyPolicy(): React.JSX.Element {
	return (
		<GridSection>
			<div className="container space-y-20 py-20 pt-30 max-w-5xl">
				<SiteHeading
					badge="Legal"
					title="Privacy Policy"
					description="Learn how we collect, use, and protect your data. Please read carefully to understand our practices."
				/>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{DATA_CARDS.map((item, index) => (
						<Card key={index} className="bg-accent/40">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									{item.icon}
									{item.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{item.content}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<Accordion type="single" collapsible>
					{DATA_ACCORDION.map((item, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger className="flex items-center justify-between text-lg font-medium">
								{item.title}
							</AccordionTrigger>
							<AccordionContent className="mt-2 text-sm leading-relaxed text-muted-foreground">
								{item.content}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div>
					<CardTitle className="text-lg text-primary">
						Contact Information
					</CardTitle>
					<p className="text-sm leading-relaxed">
						For questions or concerns, contact us at:
						<br />
						<a
							href="mailto:hello@recruut.io"
							className="text-blue-500 hover:underline"
						>
							hello@recruut.io
						</a>
					</p>
				</div>
			</div>
		</GridSection>
	);
}
