import { FinanceListCard } from '@/app/(app)/dashboard/components/FinanceList/FinanceListCard';
import { FinanceListFilter } from '@/app/(app)/dashboard/components/FinanceList/FinanceListFilter';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/ui/components/Card';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { Spinner, Theme } from '@radix-ui/themes';
import React from 'react';

export const FinanceList = (): JSX.Element => {
  const { cloneTransaction, deleteTransaction, editTransaction } =
    useFinanceTracker();
  const { transactionsQuery } = useDashboard();
  const data = transactionsQuery?.data;
  const isLoading = transactionsQuery?.loading;

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Finance List</CardTitle>
        <FinanceListFilter />
      </CardHeader>
      <CardContent className="h-0 grow overflow-auto">
        {isLoading || !data ? (
          <Theme className="flex size-full justify-center bg-transparent">
            <Spinner size="3" />
          </Theme>
        ) : (
          <div className="space-y-4">
            {(data.data || []).map(
              (
                transaction: TransactionModel,
                index: number,
                arr: TransactionModel[],
              ) => (
                <React.Fragment key={transaction.id}>
                  {arr[index - 1]?.date !== transaction.date && (
                    <h3 className="mb-2 font-semibold">
                      {transaction.Date.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                      })}
                      ,{' '}
                      {transaction.Date.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                      })}{' '}
                      de{' '}
                      {transaction.Date.toLocaleDateString('pt-BR', {
                        month: 'long',
                      })}
                    </h3>
                  )}
                  <FinanceListCard
                    cloneTransaction={cloneTransaction}
                    deleteTransaction={deleteTransaction}
                    editTransaction={editTransaction}
                    transaction={transaction}
                  />
                </React.Fragment>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
