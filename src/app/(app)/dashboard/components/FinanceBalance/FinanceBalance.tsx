'use client';

import { FinanceBalanceAccountCard } from '@/app/(app)/dashboard/components/FinanceBalance/FinanceBalanceAccountCard';
import { AccountBalance } from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { BalanceAmount } from '@/lib/ui/components/BalanceAmount';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/ui/components/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/lib/ui/components/Tabs';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { $Enums as PrismaEnum } from '@prisma/client';
import { Spinner, Theme } from '@radix-ui/themes';
import React from 'react';

export const FinanceBalance = (): JSX.Element => {
  const { financeListFilters } = useDashboard();
  const { balanceBiQuery } = useDashboard();
  const data = balanceBiQuery?.data;
  const isLoading = balanceBiQuery?.loading;

  return (
    <Card className="flex w-full flex-col lg:overflow-hidden">
      <CardHeader>
        <CardTitle>Finance Balance</CardTitle>
      </CardHeader>
      <CardContent className="grow overflow-auto">
        {isLoading || !data ? (
          <Theme className="flex size-full justify-center bg-transparent">
            <Spinner size="3" />
          </Theme>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Prev Month Balance
                </p>
                <BalanceAmount
                  amount={data.prevMonthBalance}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Current Balance
                </p>
                <BalanceAmount
                  amount={data.currMonthBalance}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total Incoming
                </p>
                <BalanceAmount
                  amount={data.currMonthIncome}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total Expenses
                </p>
                <BalanceAmount
                  amount={data.currMonthExpense}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            <Tabs
              defaultValue={
                financeListFilters?.paymentMethod?.length === 1 &&
                financeListFilters?.paymentMethod?.includes(
                  PrismaEnum.PaymentMethodEnum.CREDIT_CARD,
                )
                  ? 'credit-cards'
                  : 'accounts'
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="credit-cards">Credit Cards</TabsTrigger>
              </TabsList>
              <TabsContent value="accounts">
                <div className="space-y-4">
                  {data.accounts.map((account: AccountBalance) => (
                    <FinanceBalanceAccountCard
                      account={account}
                      key={account.id}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="credit-cards">
                <div className="space-y-4">
                  {data.creditCards.map((account: AccountBalance) => (
                    <FinanceBalanceAccountCard
                      account={account}
                      isCreditCard
                      key={account.id}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};
