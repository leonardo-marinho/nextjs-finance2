import { AccountBalance } from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { BalanceAmount } from '@/lib/ui/components/BalanceAmount';
import { Card, CardContent } from '@/lib/ui/components/Card';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { $Enums as PrismaEnum } from '@prisma/client';
import React from 'react';

interface FinanceBalanceAccountCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  account: AccountBalance;
  isCreditCard?: boolean;
}

export const FinanceBalanceAccountCard = ({
  account,
  isCreditCard,
}: FinanceBalanceAccountCardProps): JSX.Element => {
  const { updateFinanceListFilters } = useDashboard();
  const handleAccountClick = (): void =>
    updateFinanceListFilters({
      accountId: Number(account.id),
      paymentMethod: isCreditCard
        ? [PrismaEnum.PaymentMethodEnum.CREDIT_CARD]
        : [PrismaEnum.PaymentMethodEnum.ACCOUNT],
    });

  return (
    <Card key={account.id}>
      <CardContent className="cursor-pointer p-4" onClick={handleAccountClick}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{account.name}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Current expenses
            </p>
          </div>
          <BalanceAmount
            amount={account.balance}
            className="text-lg font-semibold"
          />
        </div>
      </CardContent>
    </Card>
  );
};
