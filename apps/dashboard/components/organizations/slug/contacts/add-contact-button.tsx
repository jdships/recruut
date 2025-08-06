"use client";

import NiceModal from "@ebay/nice-modal-react";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type * as React from "react";
import { AddContactModal } from "~/components/organizations/slug/contacts/add-contact-modal";

export function AddContactButton(): React.JSX.Element {
	const handleShowAddContactModal = (): void => {
		NiceModal.show(AddContactModal);
	};
	return (
		<Button
			type="button"
			variant="default"
			size="sm"
			className="whitespace-nowrap"
			onClick={handleShowAddContactModal}
		>
			<IconCirclePlusFilled className="size-4" />
			New Contact
		</Button>
	);
}
