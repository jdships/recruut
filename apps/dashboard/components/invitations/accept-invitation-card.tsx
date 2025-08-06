'use client';

import * as React from 'react';
import { type SubmitHandler } from 'react-hook-form';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { toast } from '@workspace/ui/components/sonner';
import { cn } from '@workspace/ui/lib/utils';

import { acceptInvitation } from '~/actions/invitations/accept-invitation';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  acceptInvitationSchema,
  type AcceptInvitationSchema
} from '~/schemas/invitations/accept-invitation-schema';

export type AcceptInvitationCardProps = CardProps & {
  invitationId: string;
  organizationName: string;
};

export function AcceptInvitationCard({
  invitationId,
  organizationName,
  className,
  ...other
}: AcceptInvitationCardProps): React.JSX.Element {
  const methods = useZodForm({
    schema: acceptInvitationSchema,
    mode: 'all',
    defaultValues: {
      invitationId
    }
  });
  const canSubmit =
    !methods.formState.isSubmitting && methods.formState.isValid;
  const onSubmit: SubmitHandler<AcceptInvitationSchema> = async (values) => {
    if (!canSubmit) {
      return;
    }
    const result = await acceptInvitation(values);
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't accept invitation");
    }
  };
  return (
    <Card
      className={cn(
        'w-full px-4 py-8 border-transparent dark:border-border',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-sm font-normal text-muted-foreground">
          You have been invited to join
          <span className="block text-xl font-semibold text-foreground">
            {organizationName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="text-sm text-muted-foreground"
        >
          <input
            type="hidden"
            className="hidden"
            disabled={methods.formState.isSubmitting}
            {...methods.register('invitationId')}
          />
          Become part of an amazing team and work alongside talented
          individuals.
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="default"
          size="lg"
          className="w-full"
          disabled={!canSubmit}
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
        >
          Accept invitation
        </Button>
      </CardFooter>
    </Card>
  );
}
