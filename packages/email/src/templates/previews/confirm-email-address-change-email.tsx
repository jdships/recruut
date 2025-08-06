import * as React from 'react';

import { ConfirmEmailAddressChangeEmail } from '../confirm-email-address-change-email';

export default function ConfirmEmailAddressChangeEmailPreview(): React.JSX.Element {
  return (
    <ConfirmEmailAddressChangeEmail
      confirmLink="https://example.com/auth/change-email/request/a5cffa7e-76eb-4671-a195-d1670a7d4df3"
      name="John Doe"
    />
  );
}
