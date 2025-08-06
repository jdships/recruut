import * as React from 'react';

import {
  Card,
  CardContent,
  type CardProps
} from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';

import { MultiFactorAuthenticationList } from '~/components/organizations/slug/settings/account/security/multi-factor-authentication-list';
import type { MultiFactorAuthenticationDto } from '~/types/dtos/multi-factor-authentication-dto';

export type MultiFactorAuthenticationCardProps = CardProps &
  MultiFactorAuthenticationDto;

export function MultiFactorAuthenticationCard({
  authenticatorApp,
  className,
  ...other
}: MultiFactorAuthenticationCardProps): React.JSX.Element {
  return (
    <Card
      className={cn('flex h-full flex-col p-0', className)}
      {...other}
    >
      <CardContent className="max-h-72 flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]>div]:block!">
          <MultiFactorAuthenticationList authenticatorApp={authenticatorApp} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
