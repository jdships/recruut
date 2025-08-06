import type * as React from "react";

import { FeedbackEmail } from "../feedback-email";

export default function FeedbackEmailPreview(): React.JSX.Element {
	return (
		<FeedbackEmail
			appName="Recruut"
			category="Feature Request"
			email="john.doe@gmail.com"
			message="I would like to request a feature that allows me to change my email address."
			name="John Doe"
			organizationName="Evil Corp"
		/>
	);
}
