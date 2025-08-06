"use client";

import NiceModal from "@ebay/nice-modal-react";
import { MessageCircleMoreIcon } from "@workspace/ui/components/icons/feedback";
import { UserRoundPlusIcon } from "@workspace/ui/components/icons/invite-user";
import {
	InfoCard,
	InfoCardAction,
	InfoCardContent,
	InfoCardDescription,
	InfoCardDismiss,
	InfoCardFooter,
	InfoCardMedia,
	InfoCardTitle,
} from "@workspace/ui/components/info-card";
import {
	SidebarGroup,
	type SidebarGroupProps,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { FeedbackModal } from "~/components/organizations/slug/feedback-modal";
import { InviteMemberModal } from "~/components/organizations/slug/settings/organization/members/invite-member-modal";
import { useActiveOrganization } from "~/hooks/use-active-organization";
import { useHover } from "~/hooks/use-hover";
import type { ProfileDto } from "~/types/dtos/profile-dto";

export type NavSupportProps = SidebarGroupProps & {
	profile: ProfileDto;
};

type SupportMenuItemProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: React.ComponentType<any>;
	title: string;
	onClick: () => void;
};

function SupportMenuItem({
	icon: Icon,
	title,
	onClick,
}: SupportMenuItemProps): React.JSX.Element {
	const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				type="button"
				tooltip={title}
				className="text-muted-foreground transition-colors duration-300"
				onClick={onClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<Icon isHovered={isHovered} />
				<span>{title}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export function NavSupport({
	profile,
	...other
}: NavSupportProps): React.JSX.Element {
	const activeOrganization = useActiveOrganization();
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

	const handleShowInviteMemberModal = (): void => {
		NiceModal.show(InviteMemberModal, { profile });
	};
	const handleShowFeedbackModal = (): void => {
		NiceModal.show(FeedbackModal);
	};
	return (
		<SidebarGroup {...other}>
			<InfoCard className="mb-3 block group-data-[collapsible=icon]:hidden bg-background">
				<InfoCardContent>
					<InfoCardTitle>Welcome to Recruut</InfoCardTitle>
					<InfoCardDescription>
						See how intelligent AI transforms your recruitment workflow.
					</InfoCardDescription>
					<InfoCardMedia
						media={[
							{
								type: "video",
								src: "https://video.twimg.com/ext_tw_video/1811493439357476864/pu/vid/avc1/1280x720/r_A2n1_eDbYiTMkU.mp4?tag=12",
								autoPlay: true,
								loop: true,
							},
						]}
					/>
					<InfoCardFooter>
						<InfoCardDismiss>Dismiss</InfoCardDismiss>
						<InfoCardAction>
							<Link
								href="#"
								className="flex flex-row items-center gap-1 underline"
							>
								Learn more <ExternalLink size={12} />
							</Link>
						</InfoCardAction>
					</InfoCardFooter>
				</InfoCardContent>
			</InfoCard>

			<SidebarMenu>
				{canInvite && !loading && (
					<SupportMenuItem
						icon={UserRoundPlusIcon}
						title="Invite member"
						onClick={handleShowInviteMemberModal}
					/>
				)}
				<SupportMenuItem
					icon={MessageCircleMoreIcon}
					title="Feedback"
					onClick={handleShowFeedbackModal}
				/>
			</SidebarMenu>
		</SidebarGroup>
	);
}
