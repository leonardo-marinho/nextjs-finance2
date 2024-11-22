import { AmountModel } from '@/lib/shared/models/Amount.model';
import { cn } from '@/lib/ui/utils/classnames';
import React from 'react';

export interface BalanceAmountProps
  extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  amount: number;
  currency?: string;
  isPlaceholder?: boolean;
  isTransfer?: boolean;
}

export const BalanceAmount = React.forwardRef<
  HTMLSpanElement,
  BalanceAmountProps
>(
  (
    { amount, currency, isPlaceholder, isTransfer, ...props }: BalanceAmountProps,
    ref: React.ForwardedRef<HTMLSpanElement>,
  ) => (
    <span
      ref={ref}
      {...props}
      className={cn(
        props.className,
        amount >= 0 ? 'text-green-500' : 'text-red-500',
        isTransfer && 'text-blue-600',
        isPlaceholder && 'text-orange-500',
      )}
    >
      {new AmountModel(amount, currency).toStringWithSign()}
    </span>
  ),
);
BalanceAmount.displayName = 'BalanceAmount';
