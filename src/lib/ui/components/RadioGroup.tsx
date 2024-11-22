'use client';

import { cn } from '@/lib/ui/utils/classnames';
import { CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import React from 'react';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    ref: React.ForwardedRef<React.ElementRef<typeof RadioGroupPrimitive.Root>>,
  ) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn('grid gap-2', className)}
        {...props}
        ref={ref}
      />
    );
  },
);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    ref: React.ForwardedRef<React.ElementRef<typeof RadioGroupPrimitive.Item>>,
  ) => {
    return (
      <RadioGroupPrimitive.Item
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-neutral-900 text-neutral-900 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:border-neutral-50 dark:text-neutral-50 dark:focus-visible:ring-neutral-300',
          className,
        )}
        ref={ref}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <CheckIcon className="size-3.5" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  },
);
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
