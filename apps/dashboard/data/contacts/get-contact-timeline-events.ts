import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { and, db, desc, eq, inArray } from '@workspace/database/client';
import {
  ActorType,
  contactActivityTable,
  contactCommentTable,
  contactTable,
  userTable
} from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import {
  getContactTimelineEventsSchema,
  type GetContactTimelineEventsSchema
} from '~/schemas/contacts/get-contact-timeline-events-schema';
import type {
  ActivityTimelineEventDto,
  CommentTimelineEventDto,
  TimelineEventDto
} from '~/types/dtos/timeline-event-dto';

export async function getContactTimelineEvents(
  input: GetContactTimelineEventsSchema
): Promise<TimelineEventDto[]> {
  const ctx = await getAuthOrganizationContext();

  const result = getContactTimelineEventsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const activities = await db
        .select({
          id: contactActivityTable.id,
          contactId: contactActivityTable.contactId,
          actionType: contactActivityTable.actionType,
          actorType: contactActivityTable.actorType,
          actorId: contactActivityTable.actorId,
          metadata: contactActivityTable.metadata,
          occurredAt: contactActivityTable.occurredAt
        })
        .from(contactActivityTable)
        .innerJoin(
          contactTable,
          eq(contactActivityTable.contactId, contactTable.id)
        )
        .where(
          and(
            eq(contactTable.organizationId, ctx.organization.id),
            eq(contactActivityTable.contactId, parsedInput.contactId)
          )
        );

      const comments = await db
        .select({
          id: contactCommentTable.id,
          contactId: contactCommentTable.contactId,
          text: contactCommentTable.text,
          createdAt: contactCommentTable.createdAt,
          updatedAt: contactCommentTable.updatedAt,
          userId: contactCommentTable.userId,
          user: {
            id: userTable.id,
            name: userTable.name,
            image: userTable.image
          }
        })
        .from(contactCommentTable)
        .innerJoin(
          contactTable,
          eq(contactCommentTable.contactId, contactTable.id)
        )
        .innerJoin(userTable, eq(userTable.id, contactCommentTable.userId))
        .where(
          and(
            eq(contactTable.organizationId, ctx.organization.id),
            eq(contactCommentTable.contactId, parsedInput.contactId)
          )
        )
        .orderBy(desc(contactCommentTable.createdAt));

      const actorIds = [
        ...new Set(
          activities
            .filter((activity) => activity.actorType === ActorType.MEMBER)
            .map((activity) => activity.actorId)
        )
      ];
      const actors = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          image: userTable.image
        })
        .from(userTable)
        .where(inArray(userTable.id, actorIds));

      const mappedActivities: ActivityTimelineEventDto[] = activities.map(
        (activity) => {
          const actor = actors.find((actor) => actor.id === activity.actorId);
          return {
            id: activity.id,
            contactId: activity.contactId,
            type: 'activity',
            actionType: activity.actionType,
            actorType: activity.actorType,
            metadata: activity.metadata,
            occurredAt: activity.occurredAt,
            actor: {
              id: actor?.id ?? '',
              name: actor?.name ?? '',
              image: actor?.image ?? undefined
            }
          };
        }
      );

      const mappedComments: CommentTimelineEventDto[] = comments.map(
        (comment) => ({
          id: comment.id,
          contactId: comment.contactId,
          type: 'comment',
          text: comment.text,
          edited: comment.createdAt.getTime() !== comment.updatedAt.getTime(),
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          sender: {
            id: comment.user.id,
            name: comment.user.name,
            image: comment.user.image ?? undefined
          }
        })
      );

      const sorted: TimelineEventDto[] = [
        ...mappedActivities,
        ...mappedComments
      ].sort((a, b) => {
        const dateA = (
          a.type === 'activity' ? a.occurredAt : a.createdAt
        ).getTime();
        const dateB = (
          b.type === 'activity' ? b.occurredAt : b.createdAt
        ).getTime();
        return dateB - dateA;
      });

      return sorted;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.ContactTimelineEvents,
      ctx.organization.id,
      parsedInput.contactId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.ContactTimelineEvents,
          ctx.organization.id,
          parsedInput.contactId
        ),
        Caching.createOrganizationTag(
          OrganizationCacheKey.Contact,
          ctx.organization.id,
          parsedInput.contactId
        ),
        Caching.createOrganizationTag(
          OrganizationCacheKey.Contacts,
          ctx.organization.id
        )
      ]
    }
  )();
}
