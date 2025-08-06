'use client';

import * as React from 'react';
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  type EmojiClickData
} from 'emoji-picker-react';
import { SmileIcon } from 'lucide-react';

import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export type EmojiPopoverProps = {
  onEmojiSelected: (data: string) => void;
};

export function EmojiPopover({
  onEmojiSelected
}: EmojiPopoverProps): React.JSX.Element {
  return (
    <Popover>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
            >
              <SmileIcon className="size-5 shrink-0" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Add emoji</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-fit border-0 p-0">
        <style>
          {`
            .EmojiPickerReact {
              --epr-emoji-size: 20px !important;
            }
          `}
        </style>
        <EmojiPicker
          onEmojiClick={(data: EmojiClickData) => {
            onEmojiSelected?.(data.emoji);
          }}
          autoFocusSearch={false}
          theme={Theme.LIGHT}
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
          defaultSkinTone={SkinTones.NEUTRAL}
          emojiStyle={EmojiStyle.NATIVE}
        />
      </PopoverContent>
    </Popover>
  );
}
