import { type DayOfWeek } from '@workspace/database/schema';

import type { WorkTimeSlotDto } from '~/types/dtos/work-time-slot-dto';

export type WorkHoursDto = {
  dayOfWeek: DayOfWeek;
  timeSlots?: WorkTimeSlotDto[];
};
