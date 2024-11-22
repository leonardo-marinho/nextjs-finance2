import { FinanceTrackerInputNames } from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerSelect } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSelect';
import { FinanceTrackerSharedFooterInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedFooterInputs';
import { FinanceTrackerSharedInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedInputs';
import { Button } from '@/lib/ui/components/Button';
import { TabsContent } from '@/lib/ui/components/Tabs';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { SelectItemData } from '@/lib/ui/types/Select';
import { $Enums as PrismaEnums } from '@prisma/client';
import React, { useMemo } from 'react';

interface FinanceTrackerTransferenceTabProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsContent>, 'value'> {}

export const FinanceTrackerTransferenceTab = ({
  ...props
}: FinanceTrackerTransferenceTabProps): JSX.Element => {
  const {
    isEditMode,
    optionsSelectItems,
    saveChanges,
    setFieldValue,
    transaction,
  } = useFinanceTracker();

  const handleSave = async (): Promise<void> => saveChanges();

  const handleTransferAccountChange = (value: number | string): void =>
    setFieldValue(FinanceTrackerInputNames.TRANSFER_ACCOUNT, Number(value));

  const destinationAccounts = useMemo(
    () =>
      optionsSelectItems?.accounts.filter(
        (item: SelectItemData): boolean =>
          item.value !== String(transaction.accountId),
      ),
    [optionsSelectItems?.accounts, transaction.accountId],
  );

  return (
    <TabsContent
      {...props}
      className="!mt-0 flex flex-col gap-4"
      value={PrismaEnums.TransactionTypeEnum.TRANSFER}
    >
      <FinanceTrackerSharedInputs />
      <FinanceTrackerSelect
        data={destinationAccounts}
        defaultValue={
          !!transaction.transferAccountId
            ? String(transaction.transferAccountId)
            : undefined
        }
        label="Destination Account"
        name={FinanceTrackerInputNames.TRANSFER_ACCOUNT}
        onChange={handleTransferAccountChange}
        placeholder="Select destination account"
      />
      <FinanceTrackerSharedFooterInputs />
      <Button className="mt-5 w-full" onClick={handleSave}>
        {isEditMode ? 'Edit' : 'Add'} Transfer
      </Button>
    </TabsContent>
  );
};
