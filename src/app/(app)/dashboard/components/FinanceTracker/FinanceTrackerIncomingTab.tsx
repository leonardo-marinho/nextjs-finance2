import { FinanceTrackerSharedFooterInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedFooterInputs';
import { FinanceTrackerSharedInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedInputs';
import { Button } from '@/lib/ui/components/Button';
import { TabsContent } from '@/lib/ui/components/Tabs';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { $Enums as PrismaEnums } from '@prisma/client';
import React from 'react';

interface FinanceTrackerIncomingTabProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TabsContent>,
    'onSubmit' | 'value'
  > {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export const FinanceTrackerIncomingTab = ({
  onSubmit,
  ...props
}: FinanceTrackerIncomingTabProps) => {
  const { isEditMode, saveChanges, setFieldValue } = useFinanceTracker();

  const handleSave = async (): Promise<void> => {
    setFieldValue('type', PrismaEnums.TransactionTypeEnum.INCOME);
    saveChanges();
  };

  return (
    <TabsContent
      {...props}
      className="flex flex-col gap-4"
      value={PrismaEnums.TransactionTypeEnum.INCOME}
    >
      <FinanceTrackerSharedInputs />
      <FinanceTrackerSharedFooterInputs />
      <Button className="mt-5 w-full" onClick={handleSave}>
        {isEditMode ? 'Edit' : 'Add'} Incoming
      </Button>
    </TabsContent>
  );
};
