import {
	Body,
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

export type RejectionEmailProps = {
	applicantName: string;
	organizationName: string;
	positionTitle: string;
	organizationWebsite?: string;
};

export function RejectionEmail({
	applicantName,
	organizationName,
	positionTitle,
	organizationWebsite,
}: RejectionEmailProps): React.JSX.Element {
	return (
		<Html>
			<Head />
			<Preview>
				Thank you for your interest in {positionTitle} at {organizationName}
			</Preview>
			<Tailwind>
				<Body className="m-auto bg-white px-2 font-sans">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded-sm border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							Thank you for your application
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Dear {applicantName},
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Thank you for taking the time to apply for the{" "}
							<strong>{positionTitle}</strong> position at{" "}
							<strong>{organizationName}</strong>. We appreciate your interest
							in joining our team and the effort you put into your application.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							After careful consideration, we have decided to move forward with
							other candidates whose qualifications more closely align with our
							current needs for this specific role.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							However, we were impressed by your background and experience. We
							will keep your application on file and would be delighted to
							consider you for future opportunities that may be a better match
							for your skills and career aspirations.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							We encourage you to continue following our company and apply for
							positions that interest you in the future. We wish you the very
							best in your job search and career.
						</Text>
						<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
						<Text className="text-[14px] leading-[24px] text-black">
							Thank you again for your interest in{" "}
							<strong>{organizationName}</strong>.
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
									Visit our website
								</Link>
							</Section>
						)}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
