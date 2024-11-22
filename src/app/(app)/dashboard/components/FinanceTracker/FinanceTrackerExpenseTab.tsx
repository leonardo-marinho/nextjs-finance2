import { FinanceTrackerInputNames } from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerSelect } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSelect';
import { FinanceTrackerSharedFooterInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedFooterInputs';
import { FinanceTrackerSharedInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedInputs';
import { Button } from '@/lib/ui/components/Button';
import { TabsContent } from '@/lib/ui/components/Tabs';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { $Enums as PrismaEnums } from '@prisma/client';
import React from 'react';

interface FinanceTrackerExpenseTabProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsContent>, 'value'> {}

export const FinanceTrackerExpenseTab = ({
  ...props
}: FinanceTrackerExpenseTabProps): JSX.Element => {
  const { isEditMode, saveChanges, setFieldValue, transaction } =
    useFinanceTracker();

  const handleSave = async (): Promise<void> => {
    setFieldValue('type', PrismaEnums.TransactionTypeEnum.EXPENSE);
    saveChanges();
  };

  const handlePaymentMethodChange = (value: number | string): void =>
    setFieldValue(FinanceTrackerInputNames.PAYMENT_METHOD, value);

  return (
    <TabsContent
      {...props}
      className="!mt-0 flex flex-col gap-4"
      value={PrismaEnums.TransactionTypeEnum.EXPENSE}
    >
      <FinanceTrackerSharedInputs />
      <FinanceTrackerSelect
        data={[
          {
            label: 'Account',
            value: PrismaEnums.PaymentMethodEnum.ACCOUNT,
          },
          {
            label: 'Credit Card',
            value: PrismaEnums.PaymentMethodEnum.CREDIT_CARD,
          },
        ]}
        defaultValue={
          !!transaction.paymentMethod
            ? `${transaction.paymentMethod}`
            : undefined
        }
        label="Payment Method"
        name={FinanceTrackerInputNames.PAYMENT_METHOD}
        onChange={handlePaymentMethodChange}
        placeholder="Select payment method"
      />
      <FinanceTrackerSharedFooterInputs />
      <Button className="mt-5 w-full" onClick={handleSave}>
        {isEditMode ? 'Edit' : 'Add'} Expense
      </Button>
    </TabsContent>
  );
};
