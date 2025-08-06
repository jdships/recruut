import type * as React from "react";

import { InvitationEmail } from "../invitation-email";

export default function InvitationEmailPreview(): React.JSX.Element {
	return (
		<InvitationEmail
			appName="Recruut"
			invitedByEmail="jane.doe@gmail.com"
			invitedByName="Jane Doe"
			inviteLink="https://example.com/invitations/request/a5cffa7e-76eb-4671-a195-d1670a7d4df3"
			organizationName="Evil Corp"
		/>
	);
}
