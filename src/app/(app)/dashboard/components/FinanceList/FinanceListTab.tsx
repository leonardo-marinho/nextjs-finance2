import { FinanceListCard } from '@/app/(app)/dashboard/components/FinanceList/FinanceListCard';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import React from 'react';

interface FinanceListTabProps {
  data: TransactionModel[];
}

export const FinanceListTab = ({ data }: FinanceListTabProps): JSX.Element => {
  const { cloneTransaction, deleteTransaction, editTransaction } =
    useFinanceTracker();

  return (
    <div className="space-y-4">
      {(data || []).map(
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
  );
};
