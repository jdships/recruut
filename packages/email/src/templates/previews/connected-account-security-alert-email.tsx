import type * as React from "react";

import { ConnectedAccountSecurityAlertEmail } from "../connected-account-security-alert-email";

export default function ConnectedAccountSecurityAlertEmailPreview(): React.JSX.Element {
	return (
		<ConnectedAccountSecurityAlertEmail
			action="disconnected"
			appName="Recruut"
			name="John Doe"
			provider="Google"
		/>
	);
}
