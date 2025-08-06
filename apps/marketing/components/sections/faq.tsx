"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@workspace/ui/components/accordion";

export default function FAQ() {
	const faqItems = [
		{
			id: "item-1",
			question: "What is Recruut and how does it work?",
			answer:
				"Recruut is an AI-powered recruiting platform that automates candidate screening, intake, and scoring. Our chat-based forms engage applicants, collect structured data, and help you identify top talent faster.",
		},
		{
			id: "item-2",
			question: "How does Recruut use AI in the hiring process?",
			answer:
				"Our AI chat forms ask smart, adaptive questions, flag incomplete or low-quality applications, and score candidates based on your criteria. This saves your team hours and ensures you focus on the best applicants.",
		},
		{
			id: "item-3",
			question: "Is my data and my applicants’ data secure?",
			answer:
				"Absolutely. We use industry-standard encryption and privacy practices to keep all recruiter and applicant data safe and compliant.",
		},
		{
			id: "item-4",
			question: "How easy is it to onboard my team?",
			answer:
				"Recruut is designed for fast onboarding. Invite your team, set up your first opportunity, and start screening candidates in minutes. Our support team is here to help if you need it.",
		},
		{
			id: "item-5",
			question: "Can I customize the application process?",
			answer:
				"Yes! You can tailor chat questions, scoring rules, and workflows to fit your unique hiring needs.",
		},
		{
			id: "item-6",
			question: "What is the candidate experience like?",
			answer:
				"Applicants complete a friendly, mobile-optimized chat form that guides them step by step. It’s fast, intuitive, and increases completion rates.",
		},
		{
			id: "item-7",
			question: "How do I get support or contact the team?",
			answer:
				"You can reach us anytime via our contact page. We’re happy to help with onboarding, troubleshooting, or feedback.",
		},
	];

	return (
		<section className="py-12" id="faq">
			<div className="@container mx-auto w-full max-w-6xl px-6 lg:px-12">
				<div>
					<h2 className="text-foreground mt-4 text-4xl font-semibold">
						Frequently Asked Questions
					</h2>
					<p className="text-muted-foreground mt-4 text-balance text-lg">
						You can find answers to most questions here.
					</p>
				</div>

				<div className="mt-12">
					<Accordion
						type="single"
						collapsible
						className="bg-card ring-border rounded-lg w-full border border-transparent px-8 py-3 shadow ring-1"
					>
						{faqItems.map((item) => (
							<AccordionItem
								key={item.id}
								value={item.id}
								className="border-dotted"
							>
								<AccordionTrigger className="cursor-pointer text-base hover:no-underline">
									{item.question}
								</AccordionTrigger>
								<AccordionContent>
									<p className="text-base">{item.answer}</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
