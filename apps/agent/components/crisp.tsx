"use client";

import { Crisp } from "crisp-sdk-web";
import { Component } from "react";

class CrispChat extends Component {
	componentDidMount() {
		// Configure with your Crisp website ID
		// Get your website ID from: https://app.crisp.chat/settings/websites/
		const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
		if (crispWebsiteId) {
			Crisp.configure(crispWebsiteId);
		}
	}

	render() {
		return null;
	}
}
export default CrispChat;
