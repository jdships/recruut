import type * as React from "react";

import { InvoicesCard } from "~/components/organizations/slug/settings/organization/billing/invoices-card";

export default async function InvoicesPage(): Promise<React.JSX.Element> {
	return <InvoicesCard />;
}
