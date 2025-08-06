'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { TrashIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@workspace/ui/components/form';
import { ImageDropzone } from '@workspace/ui/components/image-dropzone';
import { Input } from '@workspace/ui/components/input';
import { toast } from '@workspace/ui/components/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

import { NextButton } from '~/components/onboarding/next-button';
import type { OnboardingStepProps } from '~/components/onboarding/onboarding-step-props';
import { CropPhotoModal } from '~/components/organizations/slug/settings/account/profile/crop-photo-modal';
import { FileUploadAction, MAX_IMAGE_SIZE } from '~/lib/file-upload';
import { getInitials } from '~/lib/formatters';
import { type CompleteOnboardingSchema } from '~/schemas/onboarding/complete-onboarding-schema';

export type OnboardingProfileStepProps =
  React.HtmlHTMLAttributes<HTMLDivElement> & OnboardingStepProps;

export function OnboardingProfileStep({
  canNext,
  loading,
  isLastStep,
  handleNext,
  className,
  ...other
}: OnboardingProfileStepProps): React.JSX.Element {
  const methods = useFormContext<CompleteOnboardingSchema>();
  const image = methods.watch('profileStep.image');
  const name = methods.watch('profileStep.name');
  const email = methods.watch('profileStep.email');
  const handleDrop = async (files: File[]): Promise<void> => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `Uploaded image shouldn't exceed ${MAX_IMAGE_SIZE / 1000000} MB size limit`
        );
      } else {
        const base64Image: string = await NiceModal.show(CropPhotoModal, {
          file,
          aspectRatio: 1,
          circularCrop: true
        });
        if (base64Image) {
          methods.setValue('profileStep.action', FileUploadAction.Update);
          methods.setValue('profileStep.image', base64Image, {
            shouldValidate: true,
            shouldDirty: true
          });
        }
      }
    }
  };
  const handleRemoveImage = (): void => {
    methods.setValue('profileStep.action', FileUploadAction.Delete);
    methods.setValue('profileStep.image', undefined, {
      shouldValidate: true,
      shouldDirty: true
    });
  };
  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      {...other}
    >
      <h1 className="text-xl font-semibold leading-none tracking-tight lg:text-2xl">
        Set up your profile
      </h1>
      <p className="text-sm text-muted-foreground lg:text-base">
        Check if the profile information is correct. You'll be able to change
        this later in the account settings page.
      </p>
      <div className="mt-4 flex items-center justify-center pb-6">
        <div className="relative">
          <ImageDropzone
            accept={{ 'image/*': [] }}
            multiple={false}
            borderRadius="full"
            onDrop={handleDrop}
            src={image}
            className="max-h-[120px] min-h-[120px] w-[120px] p-0.5"
            disabled={loading}
          >
            <Avatar className="size-28">
              <AvatarFallback className="size-28 text-2xl">
                {name && getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </ImageDropzone>
          {image && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-1 -right-1 z-10 size-8 rounded-full bg-background opacity-100!"
                  disabled={loading}
                  onClick={handleRemoveImage}
                >
                  <TrashIcon className="size-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Remove image</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="grid gap-x-8 gap-y-4">
        <FormField
          control={methods.control}
          name="profileStep.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  maxLength={64}
                  autoComplete="name"
                  required
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="profileStep.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  maxLength={32}
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-2 flex flex-col space-y-2">
          <FormLabel required>Email</FormLabel>
          <Input
            type="email"
            maxLength={255}
            autoComplete="username"
            value={email}
            disabled
          />
        </div>
      </div>
      <NextButton
        loading={loading}
        disabled={!canNext}
        isLastStep={isLastStep}
        onClick={handleNext}
      />
    </div>
  );
}
