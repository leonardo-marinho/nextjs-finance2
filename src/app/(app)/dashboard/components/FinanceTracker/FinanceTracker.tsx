'use client';
import { FinanceTrackerExpenseTab } from '@/app/(app)/dashboard/components/FinanceTracker/FinanceTrackerExpenseTab';
import { FinanceTrackerIncomingTab } from '@/app/(app)/dashboard/components/FinanceTracker/FinanceTrackerIncomingTab';
import { Button } from '@/lib/ui/components/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/ui/components/Card';
import { Tabs, TabsList, TabsTrigger } from '@/lib/ui/components/Tabs';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { $Enums as PrismaEnums } from '@prisma/client';
import { Spinner, Theme } from '@radix-ui/themes';
import { X } from 'lucide-react';
import React, { useState } from 'react';

export const FinanceTracker = (): JSX.Element => {
  const { isUpdatingUI, tab, updateTab } = useFinanceTracker();
  const [showTracker, setShowTracker] = useState(false);

  const handleTabChange = (tabName: string): void =>
    updateTab(tabName as PrismaEnums.TransactionTypeEnum);

  return (
    <>
      <Card className="flex size-full flex-col overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Finance Tracker</CardTitle>
          {showTracker && (
            <Button
              onClick={() => setShowTracker(false)}
              size="icon"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isUpdatingUI ? (
            <Theme className="flex size-full justify-center bg-transparent">
              <Spinner size="3" />
            </Theme>
          ) : (
            <Tabs onValueChange={handleTabChange} value={tab}>
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value={PrismaEnums.TransactionTypeEnum.INCOME}>
                  Income
                </TabsTrigger>
                <TabsTrigger value={PrismaEnums.TransactionTypeEnum.EXPENSE}>
                  Expense
                </TabsTrigger>
                {/* <TabsTrigger value={PrismaEnums.TransactionTypeEnum.TRANSFER}>
              Transfer
            </TabsTrigger> */}
              </TabsList>
              <>
                <FinanceTrackerIncomingTab />
                <FinanceTrackerExpenseTab />
              </>
              {/* <FinanceTrackerTransferenceTab /> */}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </>
  );
};
