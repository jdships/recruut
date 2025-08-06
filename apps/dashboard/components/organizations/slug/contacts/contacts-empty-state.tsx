import { EmptyState } from "@workspace/ui/components/empty-state";
import { ContactIcon } from "lucide-react";
import type * as React from "react";

import { AddContactButton } from "~/components/organizations/slug/contacts/add-contact-button";

export function ContactsEmptyState(): React.JSX.Element {
	return (
		<div className="p-6">
			<EmptyState
				icon={
					<div className="flex size-12 items-center justify-center rounded-md border">
						<ContactIcon className="size-6 shrink-0 text-muted-foreground" />
					</div>
				}
				title="No contacts yet"
				description="Contacts you add will show up here."
			>
				<AddContactButton />
			</EmptyState>
		</div>
	);
}
