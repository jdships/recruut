import { type Role } from '@workspace/database/schema';

import type { PersonalDetailsDto } from '~/types/dtos/personal-details-dto';
import type { PreferencesDto } from '~/types/dtos/preferences-dto';

type ActiveOrganizationPermissions = { isOwner: boolean; role: Role };

export type ProfileDto = PersonalDetailsDto &
  PreferencesDto &
  ActiveOrganizationPermissions;
