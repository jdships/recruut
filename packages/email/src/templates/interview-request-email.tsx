import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import type * as React from "react";

export type InterviewRequestEmailProps = {
	applicantName: string;
	organizationName: string;
	positionTitle: string;
	organizationWebsite?: string;
	schedulingLink?: string;
};

export function InterviewRequestEmail({
	applicantName,
	organizationName,
	positionTitle,
	organizationWebsite,
	schedulingLink,
}: InterviewRequestEmailProps): React.JSX.Element {
	return (
		<Html>
			<Head />
			<Preview>
				Great news! We'd love to interview you for {positionTitle} at{" "}
				{organizationName}
			</Preview>
			<Tailwind>
				<Body className="m-auto bg-white px-2 font-sans">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded-sm border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							🎉 Interview Invitation
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Dear {applicantName},
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Great news! We were impressed by your application for the{" "}
							<strong>{positionTitle}</strong> position at{" "}
							<strong>{organizationName}</strong>, and we would love to learn
							more about you.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							We're excited to invite you to interview with our team. This is an
							excellent opportunity for us to discuss your experience, learn
							about your career goals, and share more details about the role and
							our company culture.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							<strong>Next Steps:</strong>
						</Text>
						<Text className="text-[14px] leading-[24px] text-black ml-4">
							• We'll reach out within the next 1-2 business days to schedule
							your interview
							<br />• The interview will typically last 45-60 minutes
							<br />• We'll discuss your background, the role, and answer any
							questions you have
							<br />• Come prepared with questions about the position and our
							team!
						</Text>

						{schedulingLink && (
							<Section className="my-[32px] text-center">
								<Button
									href={schedulingLink}
									className="rounded-sm bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
								>
									Schedule Your Interview
								</Button>
							</Section>
						)}

						<Text className="text-[14px] leading-[24px] text-black">
							We're looking forward to speaking with you and potentially
							welcoming you to our team. If you have any questions in the
							meantime, please don't hesitate to reach out.
						</Text>

						<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

						<Text className="text-[14px] leading-[24px] text-black">
							Congratulations on making it to this stage, and we can't wait to
							meet you!
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Best regards,
							<br />
							The {organizationName} Hiring Team
						</Text>

						{organizationWebsite && (
							<Section className="mt-[32px] text-center">
								<Link
									href={organizationWebsite}
									className="text-blue-600 no-underline text-[12px]"
								>
									Learn more about {organizationName}
								</Link>
							</Section>
						)}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
