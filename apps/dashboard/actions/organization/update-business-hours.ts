'use server';

import { revalidateTag } from 'next/cache';

import { db, eq, inArray } from '@workspace/database/client';
import { workHoursTable, workTimeSlotTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateBusinessHoursSchema } from '~/schemas/organization/update-business-hours-schema';

export const updateBusinessHours = authOrganizationActionClient
  .metadata({ actionName: 'updateBusinessHours' })
  .inputSchema(updateBusinessHoursSchema)
  .action(async ({ parsedInput, ctx }) => {
    const businessHours = await db
      .select({
        id: workHoursTable.id,
        dayOfWeek: workHoursTable.dayOfWeek
      })
      .from(workHoursTable)
      .where(eq(workHoursTable.organizationId, ctx.organization.id));

    if (!businessHours.length) {
      throw new Error('No business hours found for the organization');
    }

    await db.transaction(async (trx) => {
      // Delete existing time slots
      await trx.delete(workTimeSlotTable).where(
        inArray(
          workTimeSlotTable.workHoursId,
          businessHours.map((w) => w.id)
        )
      );

      // Create new time slots
      const newTimeSlots = parsedInput.businessHours.flatMap(
        (workHoursInput) => {
          const workHoursId = businessHours.find(
            (w) => w.dayOfWeek === workHoursInput.dayOfWeek
          )?.id;

          return workHoursId
            ? workHoursInput.timeSlots.map((timeSlot) => ({
                workHoursId,
                start: new Date(timeSlot.start),
                end: new Date(timeSlot.end)
              }))
            : [];
        }
      );

      if (newTimeSlots.length) {
        await trx.insert(workTimeSlotTable).values(newTimeSlots);
      }
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.BusinessHours,
        ctx.organization.id
      )
    );
  });
