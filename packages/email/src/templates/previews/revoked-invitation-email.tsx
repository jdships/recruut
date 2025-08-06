import type * as React from "react";

import { RevokedInvitationEmail } from "../revoked-invitation-email";

export default function RevokedInvitationEmailPreview(): React.JSX.Element {
	return (
		<RevokedInvitationEmail appName="Recruut" organizationName="Evil Corp" />
	);
}
