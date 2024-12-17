import { FinanceTrackerTag } from '@/app/(app)/dashboard/components/FinanceTracker/FinanceTrackerTag';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { BalanceAmount } from '@/lib/ui/components/BalanceAmount';
import { Button } from '@/lib/ui/components/Button';
import { Card, CardContent } from '@/lib/ui/components/Card';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { cn } from '@/lib/ui/utils/classnames';
import { capitalize } from 'lodash';
import { Copy, Info, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface FinanceListCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  cloneTransaction: ReturnType<typeof useFinanceTracker>['cloneTransaction'];
  deleteTransaction: ReturnType<typeof useFinanceTracker>['deleteTransaction'];
  editTransaction: ReturnType<typeof useFinanceTracker>['editTransaction'];
  transaction: TransactionModel;
}

export const FinanceListCard = ({
  cloneTransaction,
  deleteTransaction,
  editTransaction,
  transaction,
}: FinanceListCardProps): JSX.Element => {
  const [isDeleteButtonFirstClick, setIsDeleteButtonFirstClick] =
    useState<boolean>(false);

  const handleCopyClick = (): void => cloneTransaction(transaction);
  const handleEditClick = (): void => editTransaction(transaction);
  const handleDeleteClick = (): void => {
    if (!isDeleteButtonFirstClick) {
      setIsDeleteButtonFirstClick(true);
      setTimeout(() => {
        setIsDeleteButtonFirstClick(false);
      }, 3000);

      return;
    }

    deleteTransaction(transaction.id);
  };

  return (
    <div className="relative">
      {transaction?.notes && (
        <div className="group absolute bottom-3 right-4 z-10">
          <Info className="size-3" />
          <div className="absolute bottom-0 right-4 hidden w-max max-w-52 rounded-md bg-slate-50 px-2 py-1 text-sm text-black group-hover:block">
            {transaction.notes}
          </div>
        </div>
      )}
      <Card className="group relative" tabIndex={0}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.Category?.name}</p>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {transaction.Account?.name}{' '}
                  {transaction.isCreditCardTransaction() && ` - Credit Card`}
                </p>
              </div>
              <BalanceAmount
                amount={transaction.amount}
                className="text-right"
                isPlaceholder={transaction.isPlaceholder()}
                isTransfer={transaction.isTransfer()}
              />
            </div>
            <div className="mt-1 flex w-full gap-2 overflow-x-auto">
              {!!transaction.billingDate && (
                <span className="inline-flex items-center rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-blue-700/10">
                  {transaction.BillingDate?.toLocaleDateString('pt-BR', {
                    month: 'short',
                  })}
                </span>
              )}
              {!!transaction.repeatId && (
                <span className="inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-blue-700/10">
                  Repeats
                </span>
              )}
              {transaction?.tags
                ?.split(',')
                .map((tag: string, index: number) => (
                  <FinanceTrackerTag key={`tag-${index}`}>
                    {capitalize(tag)}
                  </FinanceTrackerTag>
                ))}
            </div>
          </div>
          <div className="absolute right-2 top-2 rounded bg-gray-50 opacity-0 shadow transition-opacity group-focus-within:opacity-100 dark:bg-neutral-900 lg:group-hover:opacity-100">
            <Button
              className="size-10 lg:size-8"
              onClick={handleEditClick}
              size="icon"
              variant="ghost"
            >
              <Pencil className="size-6 lg:size-4" />
            </Button>
            <Button
              className={'size-10 lg:size-8'}
              onClick={handleDeleteClick}
              size="icon"
              variant="ghost"
            >
              <Trash2
                className={cn(
                  'size-6 lg:size-4',
                  isDeleteButtonFirstClick && 'text-orange-400',
                )}
              />
            </Button>
            <Button
              className="size-10 lg:size-8"
              onClick={handleCopyClick}
              size="icon"
              variant="ghost"
            >
              <Copy className="size-6 lg:size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
