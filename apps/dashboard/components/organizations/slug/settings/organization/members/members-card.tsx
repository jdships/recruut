"use client";

import NiceModal from "@ebay/nice-modal-react";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	type CardProps,
} from "@workspace/ui/components/card";
import { EmptyText } from "@workspace/ui/components/empty-text";
import { InputSearch } from "@workspace/ui/components/input-search";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

import { InviteMemberModal } from "~/components/organizations/slug/settings/organization/members/invite-member-modal";
import { MemberList } from "~/components/organizations/slug/settings/organization/members/member-list";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import type { MemberDto } from "~/types/dtos/member-dto";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export type MembersCardProps = CardProps & {
	profile: ProfileDto;
	members: MemberDto[];
};

export function MembersCard({
	profile,
	members,
	className,
	...other
}: MembersCardProps): React.JSX.Element {
	const activeOrganization = useActiveOrganization();
	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const [canInvite, setCanInvite] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		const checkInvitePermissions = async () => {
			try {
				const response = await fetch(
					`/organizations/${activeOrganization.slug}/api/plan-limits/invites`,
				);
				const data = await response.json();
				setCanInvite(data.canInvite);
			} catch (error) {
				console.error("Failed to check invite permissions:", error);
				setCanInvite(false); // Default to restricted on error for security
			} finally {
				setLoading(false);
			}
		};

		checkInvitePermissions();
	}, [activeOrganization.slug]);

	const filteredMembers = members.filter(
		(member) =>
			!searchQuery ||
			member.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
			member.email.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
	);
	const handleSearchQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setSearchQuery(e.target?.value || "");
	};
	const handleShowInviteMemberModal = (): void => {
		NiceModal.show(InviteMemberModal, { profile });
	};
	return (
		<Card
			className={cn("flex h-full flex-col gap-0 pb-0", className)}
			{...other}
		>
			<CardHeader className="pb-0 flex flex-row items-center gap-2">
				<InputSearch
					placeholder="Filter by name or email"
					value={searchQuery}
					onChange={handleSearchQueryChange}
				/>
				{canInvite && !loading && (
					<Button
						type="button"
						variant="default"
						size="default"
						className="whitespace-nowrap"
						onClick={handleShowInviteMemberModal}
					>
						Invite member
					</Button>
				)}
			</CardHeader>
			<CardContent className="max-h-72 flex-1 overflow-hidden p-0">
				{filteredMembers.length > 0 ? (
					<ScrollArea className="h-full">
						<MemberList profile={profile} members={filteredMembers} />
					</ScrollArea>
				) : (
					<EmptyText className="p-6">
						No member found {!!searchQuery && " (filtered)"}.
					</EmptyText>
				)}
			</CardContent>
		</Card>
	);
}
