import * as React from 'react';

import { MembersCard } from '~/components/organizations/slug/settings/organization/members/members-card';
import { getProfile } from '~/data/account/get-profile';
import { getMembers } from '~/data/members/get-members';

export default async function TeamPage(): Promise<React.JSX.Element> {
  const [profile, members] = await Promise.all([getProfile(), getMembers()]);
  return (
    <MembersCard
      profile={profile}
      members={members}
    />
  );
}
