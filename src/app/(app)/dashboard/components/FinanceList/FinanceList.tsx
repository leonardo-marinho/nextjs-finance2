import { FinanceListFilter } from '@/app/(app)/dashboard/components/FinanceList/FinanceListFilter';
import { FinanceListTab } from '@/app/(app)/dashboard/components/FinanceList/FinanceListTab';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
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
import { Spinner, Theme } from '@radix-ui/themes';
import React, { useMemo } from 'react';

export const FinanceList = () => {
  const { financeListTab, transactionsQuery, updateFinanceListTab } =
    useDashboard();
  const data = transactionsQuery?.data;

  const accountTransactions = useMemo(
    () =>
      data?.filter(
        (transaction: TransactionModel) =>
          !transaction.isCreditCardTransaction(),
      ) || [],
    [data],
  );

  const creditCardTransactions = useMemo(
    () =>
      data?.filter((transaction: TransactionModel) =>
        transaction.isCreditCardTransaction(),
      ) || [],
    [data],
  );

  const handleTabChange = (tabName: string): void =>
    updateFinanceListTab(tabName);

  const isLoading = transactionsQuery?.isLoading;

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
          <Tabs onValueChange={handleTabChange} value={financeListTab}>
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value={'account'}>
                Account ({accountTransactions.length})
              </TabsTrigger>
              <TabsTrigger value={'credit-card'}>
                Credit Card Bill ({creditCardTransactions.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-4" value={'account'}>
              <FinanceListTab data={accountTransactions} />
            </TabsContent>
            <TabsContent className="flex flex-col gap-4" value={'credit-card'}>
              <FinanceListTab data={creditCardTransactions} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
