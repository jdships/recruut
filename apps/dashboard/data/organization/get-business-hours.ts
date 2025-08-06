import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { workHoursTable, workTimeSlotTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { WorkHoursDto } from '~/types/dtos/work-hours-dto';

export async function getBusinessHours(): Promise<WorkHoursDto[]> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const workHours = await db
        .select({
          dayOfWeek: workHoursTable.dayOfWeek,
          timeSlotId: workTimeSlotTable.id,
          start: workTimeSlotTable.start,
          end: workTimeSlotTable.end
        })
        .from(workHoursTable)
        .leftJoin(
          workTimeSlotTable,
          eq(workHoursTable.id, workTimeSlotTable.workHoursId)
        )
        .where(eq(workHoursTable.organizationId, ctx.organization.id));

      if (!workHours.length) {
        throw new NotFoundError(
          'Organization not found or no business hours set'
        );
      }

      const businessHours: WorkHoursDto[] = workHours.reduce(
        (acc: WorkHoursDto[], current) => {
          const timeSlot =
            current.timeSlotId && current.start && current.end
              ? {
                  id: current.timeSlotId,
                  start: current.start.toISOString(),
                  end: current.end.toISOString()
                }
              : null;

          let dayBusinessHours = acc.find(
            (item) => item.dayOfWeek === current.dayOfWeek
          );
          if (!dayBusinessHours) {
            dayBusinessHours = { dayOfWeek: current.dayOfWeek, timeSlots: [] };
            acc.push(dayBusinessHours);
          }

          if (timeSlot) {
            dayBusinessHours.timeSlots!.push(timeSlot);
          }

          return acc;
        },
        []
      );

      return businessHours;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.BusinessHours,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.BusinessHours,
          ctx.organization.id
        )
      ]
    }
  )();
}
