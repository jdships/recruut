'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { type SubmitHandler } from 'react-hook-form';

import { baseUrl, getPathname, routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { toast } from '@workspace/ui/components/sonner';

import { checkIfSlugIsAvailable } from '~/actions/organization/check-if-slug-is-available';
import { updateOrganizationSlug } from '~/actions/organization/update-organization-slug';
import { useZodForm } from '~/hooks/use-zod-form';
import { checkIfSlugIsAvailableSchema } from '~/schemas/organization/check-if-slug-is-available-schema';
import {
  updateOrganizationSlugSchema,
  type UpdateOrganizationSlugSchema
} from '~/schemas/organization/update-organization-slug-schema';

export type OrganizationDetailsCardProps = CardProps & {
  slug: string;
};

export function OrganizationSlugCard({
  slug: initialSlug,
  ...other
}: OrganizationDetailsCardProps): React.JSX.Element {
  const methods = useZodForm({
    schema: updateOrganizationSlugSchema,
    mode: 'onSubmit',
    defaultValues: {
      slug: initialSlug
    }
  });
  useShowSlugUpdatedOnQueryParam();
  const slug = methods.watch('slug');
  const canSubmit = !methods.formState.isSubmitting && initialSlug !== slug;
  const onSubmit: SubmitHandler<UpdateOrganizationSlugSchema> = async (
    values
  ) => {
    if (!canSubmit) {
      return;
    }

    if (initialSlug !== values.slug) {
      const isValid = checkIfSlugIsAvailableSchema.safeParse({
        slug: values.slug
      }).success;
      if (isValid) {
        const result = await checkIfSlugIsAvailable({ slug: values.slug });
        if (!result?.data?.isAvailable) {
          methods.setError('slug', {
            type: 'validate',
            message: 'This slug is already taken.'
          });
          return;
        }
      }
    }
    const result = await updateOrganizationSlug(values);
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't update slug");
    }
  };
  return (
    <FormProvider {...methods}>
      <Card {...other}>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <FormField
              control={methods.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel required>Slug</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      maxLength={255}
                      required
                      disabled={methods.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="break-all">
                    {getPathname(
                      routes.dashboard.organizations.Index,
                      baseUrl.Dashboard
                    )}
                    /{slug}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </CardContent>
        <Separator />
        <CardFooter className="flex w-full justify-end">
          <Button
            type="button"
            variant="default"
            size="default"
            disabled={!canSubmit}
            loading={methods.formState.isSubmitting}
            onClick={methods.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  );
}

// Workaround to show a status message when the organization slug has been updated successfully.
// Client-side redirection might cause errors depending on the rendering cycle, because the current slug became invalid.
// To solve this we use server-side redirection + query param for the success message.
function useShowSlugUpdatedOnQueryParam(): void {
  const searchParams = useSearchParams();
  const updated = searchParams.get('slugUpdated');
  const hasShownToast = React.useRef(false);

  React.useEffect(() => {
    if (updated === 'true' && !hasShownToast.current) {
      toast.success('Slug updated');
      hasShownToast.current = true;

      // Clean up the query parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('slugUpdated');
      window.history.replaceState({}, '', url.toString());
    }
  }, [updated]);
}
