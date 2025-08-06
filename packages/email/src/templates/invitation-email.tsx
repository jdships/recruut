import * as React from 'react';
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
  Text
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

export type InvitationEmailProps = {
  appName: string;
  invitedByName: string;
  invitedByEmail: string;
  organizationName: string;
  inviteLink: string;
};

export function InvitationEmail({
  appName,
  invitedByName,
  invitedByEmail,
  organizationName,
  inviteLink
}: InvitationEmailProps): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>
        Join {organizationName} on {appName}
      </Preview>
      <Tailwind>
        <Body className="m-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-sm border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{organizationName}</strong> on{' '}
              <strong>{appName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByName}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to join the <strong>{organizationName}</strong>{' '}
              organization on <strong>{appName}</strong>.
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                href={inviteLink}
                className="rounded-sm bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              >
                Accept
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link
                href={inviteLink}
                className="text-blue-600 no-underline"
              >
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this invitation, you can ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
