'use client';

import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';
import { type SubmitHandler } from 'react-hook-form';

import { Role } from '@workspace/database/schema';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@workspace/ui/components/drawer';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import { toast } from '@workspace/ui/components/sonner';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';
import { cn } from '@workspace/ui/lib/utils';

import { checkIfCanBeInvited } from '~/actions/invitations/check-if-can-be-invited';
import { sendInvitation } from '~/actions/invitations/send-invitation';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { useZodForm } from '~/hooks/use-zod-form';
import { roleLabels } from '~/lib/labels';
import {
  sendInvitationSchema,
  type SendInvitationSchema
} from '~/schemas/invitations/send-invitation-schema';
import type { ProfileDto } from '~/types/dtos/profile-dto';

export type InviteMemberModalProps = NiceModalHocProps & {
  profile: ProfileDto;
};

export const InviteMemberModal = NiceModal.create<InviteMemberModalProps>(
  ({ profile }) => {
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const methods = useZodForm({
      schema: sendInvitationSchema,
      mode: 'onSubmit',
      defaultValues: {
        email: '',
        role: Role.MEMBER
      }
    });
    const title = 'Invite member';
    const description =
      'Enter the email address and role of the person you want to invite.';
    const canSubmit =
      !methods.formState.isSubmitting &&
      (!methods.formState.isSubmitted || methods.formState.isDirty);
    const onSubmit: SubmitHandler<SendInvitationSchema> = async (values) => {
      if (!canSubmit) {
        return;
      }
      const checkResult = await checkIfCanBeInvited({
        email: values.email
      });
      if (
        !checkResult?.serverError &&
        !checkResult?.validationErrors &&
        checkResult?.data
      ) {
        if (checkResult.data.canInvite) {
          const result = await sendInvitation(values);
          if (!result?.serverError && !result?.validationErrors) {
            toast.success('Invitation sent');
            modal.hide();
          } else {
            toast.error("Couldn't send invitation");
          }
        } else {
          methods.setError('email', {
            message: 'Already member or invited.'
          });
        }
      } else {
        toast.error("Couldn't check availability");
      }
    };
    const renderForm = (
      <form
        className={cn('space-y-4', !mdUp && 'p-4')}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  maxLength={255}
                  required
                  disabled={methods.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel required>Role</FormLabel>
              <FormControl>
                <Select
                  required
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={
                    methods.formState.isSubmitting ||
                    profile.role === Role.MEMBER
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Role).map((value: Role) => (
                      <SelectItem
                        key={value}
                        value={value}
                      >
                        {roleLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    );
    const renderButtons = (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={modal.handleClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={!canSubmit}
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
        >
          Send invitation
        </Button>
      </>
    );
    return (
      <FormProvider {...methods}>
        {mdUp ? (
          <Dialog open={modal.visible}>
            <DialogContent
              className="max-w-sm"
              onClose={modal.handleClose}
              onAnimationEndCapture={modal.handleAnimationEndCapture}
            >
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              {renderForm}
              <DialogFooter>{renderButtons}</DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer
            open={modal.visible}
            onOpenChange={modal.handleOpenChange}
          >
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>
              {renderForm}
              <DrawerFooter className="flex-col-reverse pt-4">
                {renderButtons}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </FormProvider>
    );
  }
);
