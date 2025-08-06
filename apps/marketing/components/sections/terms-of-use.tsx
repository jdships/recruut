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
			"These terms outline the rules for using our platform. By continuing to use the platform, you agree to comply with them.",
	},
	{
		title: "Eligibility",
		icon: <ScaleIcon className="size-4 shrink-0" />,
		content:
			"Users must be at least 18 years old and provide accurate details to maintain their accounts.",
	},
	{
		title: "Prohibited Uses",
		icon: <AlertCircleIcon className="size-4 shrink-0" />,
		content:
			"Users must avoid posting harmful content, distributing malware, or attempting unauthorized platform access.",
	},
];

const DATA_ACCORDION = [
	{
		title: "Intellectual Property Rights",
		content:
			"All platform content, including trademarks and materials, is owned by us. Unauthorized use is prohibited.",
	},
	{
		title: "User-Generated Content",
		content:
			"You retain ownership of content you post but grant us a license to use it. Inappropriate content may be removed at our discretion.",
	},
	{
		title: "Limitation of Liability",
		content:
			"Our platform is provided 'as is' without warranties. We are not liable for indirect damages, and users assume associated risks.",
	},
	{
		title: "Termination of Access",
		content:
			"We may suspend or terminate access for violations of these terms, fraudulent activity, or other valid reasons.",
	},
	{
		title: "Governing Law and Disputes",
		content:
			"These terms are governed by the laws of [jurisdiction]. Disputes will be resolved through arbitration or designated courts.",
	},
	{
		title: "Modifications to Terms",
		content:
			"We reserve the right to update these terms. Changes will be posted here, and continued use constitutes acceptance.",
	},
];

export function TermsOfUse(): React.JSX.Element {
	return (
		<GridSection>
			<div className="container space-y-20 py-20 pt-30 max-w-5xl">
				<SiteHeading
					badge="Legal"
					title="Terms of Use"
					description="By accessing our platform, you agree to the terms outlined below. Please read them carefully to ensure you understand your rights and responsibilities."
				/>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{DATA_CARDS.map((item, index) => (
						<Card key={`card-${item.title}-${index}`} className="bg-accent/40">
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
						<AccordionItem key={`accordion-${item.title}-${index}`} value={`item-${index}`}>
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
