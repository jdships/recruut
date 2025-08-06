import type * as React from "react";

import { WelcomeEmail } from "../welcome-email";

export default function WelcomeEmailPreview(): React.JSX.Element {
	return (
		<WelcomeEmail
			appName="Recruut"
			getStartedLink="https://example.com/organizations"
			name="John Doe"
		/>
	);
}
