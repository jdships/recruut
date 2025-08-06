'use client';

import * as React from 'react';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';

import { useTheme } from '../hooks/use-theme';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export function ThemeSwitcher(): React.JSX.Element {
  const { setTheme, theme } = useTheme();
  const themeValue = theme || 'system';
  const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTheme(e.target.value);
  };
  return (
    <div className="flex w-fit rounded-full border bg-background p-0.5">
      {[
        {
          value: 'system',
          icon: LaptopIcon,
          label: 'System'
        },
        {
          value: 'light',
          icon: SunIcon,
          label: 'Light'
        },
        {
          value: 'dark',
          icon: MoonIcon,
          label: 'Dark'
        }
      ].map(({ value, icon: Icon, label }) => (
        <span
          key={value}
          className="h-full"
        >
          <input
            className="peer sr-only"
            type="radio"
            id={`theme-switch-${value}`}
            value={value}
            checked={themeValue === value}
            onChange={handleChangeTheme}
          />
          <label
            htmlFor={`theme-switch-${value}`}
            className="flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground peer-checked:bg-accent peer-checked:text-foreground"
            aria-label={`${label} theme`}
          >
            <Tooltip delayDuration={600}>
              <TooltipTrigger asChild>
                <Icon className="size-4 shrink-0" />
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          </label>
        </span>
      ))}
    </div>
  );
}
