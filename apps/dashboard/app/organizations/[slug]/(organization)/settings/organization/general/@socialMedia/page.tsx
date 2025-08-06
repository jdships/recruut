import * as React from 'react';

import { SocialMediaCard } from '~/components/organizations/slug/settings/organization/general/social-media-card';
import { getSocialMedia } from '~/data/organization/get-social-media';

export default async function SocialMediaPage(): Promise<React.JSX.Element> {
  const socialMedia = await getSocialMedia();
  return <SocialMediaCard socialMedia={socialMedia} />;
}
