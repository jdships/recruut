'use client';

import * as React from 'react';
import { Label as LabelPrimitive, Slot as SlotPrimitive } from 'radix-ui';
import {
  Controller,
  FormProvider as RhfFormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { cn } from '../lib/utils';
import { Label } from './label';

const FormProvider = RhfFormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = ControllerProps<TFieldValues, TName>;
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

export type FormItemElement = HTMLDivElement;
export type FormItemProps = React.ComponentProps<'div'>;
function FormItem({ className, ...props }: FormItemProps) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

export type FormLabelElement = React.ComponentRef<typeof LabelPrimitive.Root>;
export type FormLabelProps = React.ComponentProps<
  typeof LabelPrimitive.Root
> & {
  required?: boolean;
};
function FormLabel({
  required,
  children,
  className,
  ...props
}: FormLabelProps) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && <span className="align-top">*</span>}
    </Label>
  );
}

export type FormControlElement = React.ComponentRef<typeof SlotPrimitive.Slot>;
export type FormControlProps = React.ComponentProps<typeof SlotPrimitive.Slot>;
function FormControl(props: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  return (
    <SlotPrimitive.Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

export type FormDescriptionElement = HTMLParagraphElement;
export type FormDescriptionProps = React.ComponentProps<'p'>;
function FormDescription({ className, ...props }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export type FormMessageElement = HTMLParagraphElement;
export type FormMessageProps = React.ComponentProps<'p'>;
function FormMessage({ className, children, ...props }: FormMessageProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : children;
  if (!body) {
    return null;
  }
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField
};
