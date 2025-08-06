import { APP_NAME } from '@workspace/common/app';
import { and, db, eq } from '@workspace/database/client';
import {
  InvitationStatus,
  invitationTable,
  membershipTable,
  Role,
  userTable
} from '@workspace/database/schema';
import { sendInvitationEmail } from '@workspace/email/send-invitation-email';
import { routes } from '@workspace/routes';

export async function checkIfCanInvite(
  email: string,
  organizationId: string
): Promise<boolean> {
  return await db.transaction(async (tx) => {
    const [existingMembership] = await tx
      .select()
      .from(membershipTable)
      .innerJoin(userTable, eq(membershipTable.userId, userTable.id))
      .where(
        and(
          eq(membershipTable.organizationId, organizationId),
          eq(userTable.email, email)
        )
      )
      .limit(1);

    const [pendingInvitation] = await tx
      .select()
      .from(invitationTable)
      .where(
        and(
          eq(invitationTable.organizationId, organizationId),
          eq(invitationTable.email, email),
          eq(invitationTable.status, InvitationStatus.PENDING)
        )
      )
      .limit(1);

    return !existingMembership && !pendingInvitation;
  });
}

export async function createInvitation(
  email: string,
  role: Role,
  organizationId: string
) {
  return await db.transaction(async (tx) => {
    // revoke old invitations
    await tx
      .update(invitationTable)
      .set({ status: InvitationStatus.REVOKED })
      .where(
        and(
          eq(invitationTable.organizationId, organizationId),
          eq(invitationTable.email, email),
          eq(invitationTable.status, InvitationStatus.PENDING)
        )
      );

    const [newInvitation] = await tx
      .insert(invitationTable)
      .values({
        email: email,
        role: role,
        organizationId: organizationId,
        lastSentAt: new Date()
      })
      .returning();

    return newInvitation;
  });
}

type SendInvitationParams = {
  email: string;
  organizationName: string;
  invitedByEmail: string;
  invitedByName: string;
  token: string;
  invitationId: string;
  organizationId: string;
};

export async function sendInvitationRequest({
  email,
  organizationName,
  invitedByEmail,
  invitedByName,
  token,
  invitationId,
  organizationId
}: SendInvitationParams): Promise<void> {
  await sendInvitationEmail({
    recipient: email,
    appName: APP_NAME,
    organizationName,
    invitedByEmail,
    invitedByName,
    inviteLink: `${routes.dashboard.invitations.Request}/${token}`
  });
  await db
    .update(invitationTable)
    .set({ lastSentAt: new Date() })
    .where(
      and(
        eq(invitationTable.id, invitationId),
        eq(invitationTable.organizationId, organizationId)
      )
    );
}
