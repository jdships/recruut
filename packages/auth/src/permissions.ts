import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { membershipTable, Role } from '@workspace/database/schema';

export async function isOrganizationOwner(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const [membership] = await db
    .select({
      isOwner: membershipTable.isOwner
    })
    .from(membershipTable)
    .where(
      and(
        eq(membershipTable.userId, userId),
        eq(membershipTable.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!membership) {
    throw new NotFoundError('Membership not found');
  }

  return membership.isOwner;
}

export async function isOrganizationAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const [membership] = await db
    .select({
      role: membershipTable.role
    })
    .from(membershipTable)
    .where(
      and(
        eq(membershipTable.userId, userId),
        eq(membershipTable.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!membership) {
    throw new NotFoundError('Membership not found');
  }

  return membership.role === Role.ADMIN;
}

export async function isOrganizationMember(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const [membership] = await db
    .select({
      role: membershipTable.role
    })
    .from(membershipTable)
    .where(
      and(
        eq(membershipTable.userId, userId),
        eq(membershipTable.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!membership) {
    throw new NotFoundError('Membership not found');
  }

  return membership.role === Role.MEMBER;
}
