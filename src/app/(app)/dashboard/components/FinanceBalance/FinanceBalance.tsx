'use client';

import { FinanceBalanceAccountCard } from '@/app/(app)/dashboard/components/FinanceBalance/FinanceBalanceAccountCard';
import {
  AccountBalance,
  BalanceBiDto,
} from '@/lib/shared/dtos/BiGetBalanceBi.dto';
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
  const data: BalanceBiDto = balanceBiQuery?.data;
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
                  amount={data.prevMonthBalanceBi.billableBalance}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  End Month Balance
                </p>
                <BalanceAmount
                  amount={data.billableBalance}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total Incoming
                </p>
                <BalanceAmount
                  amount={data.totalBillableIncome}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total Expenses
                </p>
                <BalanceAmount
                  amount={data.totalBillableExpense}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Credit Card Expenses
                </p>
                <BalanceAmount
                  amount={data.creditCardsExpense}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Credit Card Bill
                </p>
                <BalanceAmount
                  amount={data.billableCreditCardsExpense}
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
                <TabsTrigger value="credit-cards">
                  Credit Cards Bill
                </TabsTrigger>
              </TabsList>
              <TabsContent value="accounts">
                <div className="space-y-4">
                  {data.accountsBalance.map((account: AccountBalance) => (
                    <FinanceBalanceAccountCard
                      account={account}
                      key={account.id}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="credit-cards">
                <div className="space-y-4">
                  {data.billableCreditCardsBalance.map(
                    (account: AccountBalance) => (
                      <FinanceBalanceAccountCard
                        account={account}
                        isCreditCard
                        key={account.id}
                      />
                    ),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};
