'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { XIcon } from 'lucide-react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { Input } from './input';

export const tagVariants = cva(
  'inline-flex items-center whitespace-nowrap rounded-md border pl-2 text-sm transition-all',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        primary:
          'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90'
      },
      size: {
        sm: 'h-7 text-xs',
        md: 'h-8 text-sm',
        lg: 'h-9 text-base',
        xl: 'h-10 text-lg'
      },
      shape: {
        default: 'rounded-xs',
        rounded: 'rounded-md',
        square: 'rounded-none',
        pill: 'rounded-full'
      },
      borderStyle: {
        default: 'border-solid',
        none: 'border-none'
      },
      textCase: {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize'
      },
      interaction: {
        clickable: 'cursor-pointer hover:shadow-md',
        nonClickable: 'cursor-default'
      },
      animation: {
        none: '',
        fadeIn: 'animate-fadeIn',
        slideIn: 'animate-slideIn',
        bounce: 'animate-bounce'
      },
      textStyle: {
        normal: 'font-normal',
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        lineThrough: 'line-through'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'default',
      borderStyle: 'default',
      interaction: 'nonClickable',
      animation: 'fadeIn',
      textStyle: 'normal'
    }
  }
);

export type TagType = {
  id: string;
  text: string;
};

export type TagInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value'
> &
  VariantProps<typeof tagVariants> & {
    placeholder?: string;
    tags: TagType[];
    onTagsChange: (tags: TagType[]) => void;
    maxTags?: number;
    minTags?: number;
    readOnly?: boolean;
    disabled?: boolean;
    onTagAdd?: (tag: string) => void;
    onTagRemove?: (tag: string) => void;
    allowDuplicates?: boolean;
    validateTag?: (tag: string) => boolean;
    delimiter?: Delimiter;
    placeholderWhenFull?: string;
    sortTags?: boolean;
    delimiterList?: string[];
    truncate?: number;
    minLength?: number;
    maxLength?: number;
    value?: string | number | readonly string[] | TagType[]; // This `value` is for the input field itself, not for tags
    direction?: 'row' | 'column';
    onInputChange?: (value: string) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onTagClick?: (tag: TagType) => void;
    clearAll?: boolean;
    onClearAll?: () => void;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  };

export type TagElement = React.ComponentRef<'span'>;
export type TagProps = React.ComponentPropsWithoutRef<'span'> & {
  tagObj: TagType;
  onRemoveTag?: (id: string) => void;
} & Pick<
    TagInputProps,
    | 'variant'
    | 'size'
    | 'shape'
    | 'borderStyle'
    | 'textCase'
    | 'interaction'
    | 'animation'
    | 'textStyle'
    | 'direction'
    | 'onTagClick'
  >;

function Tag({
  tagObj,
  direction,
  onTagClick,
  onRemoveTag,
  variant,
  size,
  shape,
  borderStyle,
  textCase,
  interaction,
  animation,
  textStyle,
  ...props
}: TagProps): React.JSX.Element {
  return (
    <span
      key={tagObj.id}
      className={cn(
        tagVariants({
          variant,
          size,
          shape,
          borderStyle,
          textCase,
          interaction,
          animation,
          textStyle
        }),
        {
          'justify-between': direction === 'column'
        },
        !onRemoveTag && 'pr-2',
        props.className
      )}
      onClick={() => onTagClick?.(tagObj)}
      {...props}
    >
      {tagObj.text}
      {onRemoveTag && (
        <Button
          type="button"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveTag(tagObj.id);
          }}
          className="h-full px-3 py-1 hover:bg-transparent"
        >
          <XIcon className="size-[14px] shrink-0" />
        </Button>
      )}
    </span>
  );
}

export type TagListElement = React.ComponentRef<'div'>;
export type TagListProps = React.ComponentPropsWithoutRef<'div'> & {
  tags: TagType[];
  direction?: TagProps['direction'];
} & Omit<TagProps, 'tagObj' | 'className'>;
function TagList({
  tags,
  direction,
  className,
  ...tagListProps
}: TagListProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'max-w-[450px] rounded-md',
        {
          'flex flex-wrap gap-2': direction === 'row',
          'flex flex-col gap-2': direction === 'column'
        },
        className
      )}
    >
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          tagObj={tag}
          direction={direction}
          {...tagListProps}
        />
      ))}
    </div>
  );
}

export enum Delimiter {
  Comma = ',',
  Enter = 'Enter'
}

export type TagInputElement = React.ComponentRef<'div'>;
function TagInput(props: TagInputProps): React.JSX.Element | null {
  const {
    id,
    placeholder,
    tags,
    onTagsChange,
    variant,
    size,
    shape,
    className,
    maxTags,
    delimiter = Delimiter.Comma,
    onTagAdd,
    onTagRemove,
    allowDuplicates,
    validateTag,
    placeholderWhenFull = 'Max tags reached',
    sortTags,
    delimiterList,
    truncate,
    borderStyle,
    textCase,
    interaction,
    animation,
    textStyle,
    minLength,
    maxLength,
    direction = 'row',
    onInputChange,
    onFocus,
    onBlur,
    onTagClick,
    clearAll = false,
    onClearAll,
    inputProps = {}
  } = props;

  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (
    (maxTags !== undefined && maxTags < 0) ||
    (props.minTags !== undefined && props.minTags < 0)
  ) {
    console.warn('maxTags and minTags cannot be less than 0');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      delimiterList
        ? delimiterList.includes(e.key)
        : e.key === delimiter || e.key === Delimiter.Enter
    ) {
      e.preventDefault();
      const newTagText = inputValue.trim();

      if (validateTag && !validateTag(newTagText)) {
        return;
      }

      if (minLength && newTagText.length < minLength) {
        console.warn('Tag is too short');
        return;
      }

      if (maxLength && newTagText.length > maxLength) {
        console.warn('Tag is too long');
        return;
      }

      const newTagId = crypto.getRandomValues(new Uint32Array(1))[0].toString();

      if (
        newTagText &&
        (allowDuplicates || !tags.some((tag) => tag.text === newTagText)) &&
        (maxTags === undefined || tags.length < maxTags)
      ) {
        onTagsChange([...tags, { id: newTagId, text: newTagText }]);
        onTagAdd?.(newTagText);
      }
      setInputValue('');
    }
  };

  const removeTag = (idToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag.id !== idToRemove));
    onTagRemove?.(tags.find((tag) => tag.id === idToRemove)?.text || '');
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const displayedTags = sortTags
    ? [...tags].sort((a, b) => a.text.localeCompare(b.text))
    : tags;

  const truncatedTags = truncate
    ? tags.map((tag) => ({
        id: tag.id,
        text:
          tag.text?.length > truncate
            ? `${tag.text.substring(0, truncate)}...`
            : tag.text
      }))
    : displayedTags;

  const commonTagProps = {
    variant,
    size,
    shape,
    borderStyle,
    textCase,
    interaction,
    animation,
    textStyle,
    onTagClick,
    onRemoveTag: removeTag,
    direction
  };

  const tagList = (
    <TagList
      tags={truncatedTags}
      className={className}
      {...commonTagProps}
    />
  );

  const inputField = (
    <div className="w-full">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={
          maxTags !== undefined && tags.length >= maxTags
            ? placeholderWhenFull
            : placeholder
        }
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        {...inputProps}
        className={className}
        disabled={maxTags !== undefined && tags.length >= maxTags}
      />
    </div>
  );

  return (
    <div className="relative flex flex-col w-full gap-3">
      {inputField}
      {tagList}
      {clearAll && (
        <Button
          type="button"
          onClick={handleClearAll}
          className="mt-2"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}

export { TagInput, TagList, Tag };
