import type * as React from "react";

import { PasswordResetEmail } from "../password-reset-email";

export default function PasswordResetEmailPreview(): React.JSX.Element {
	return (
		<PasswordResetEmail
			appName="Recruut"
			name="John Doe"
			resetPasswordLink="https://example.com/reset-password/request/a5cffa7e-76eb-4671-a195-d1670a7d4df3"
		/>
	);
}
