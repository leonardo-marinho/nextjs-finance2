import { FinanceTrackerInputNames } from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerInput } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerInput';
import { FinanceTrackerSelect } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSelect';
import { FinanceTrackerSharedFooterInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedFooterInputs';
import { FinanceTrackerSharedInputs } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSharedInputs';
import {
  addMonths,
  getSelectValueDateString,
} from '@/lib/shared/utils/Date.utils';
import { Button } from '@/lib/ui/components/Button';
import { TabsContent } from '@/lib/ui/components/Tabs';
import {
  monthSelectItemData,
  yearSelectItemData,
} from '@/lib/ui/constants/Date.constants';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import {
  getDefaultBillingDate,
  parseBillingDate,
} from '@/lib/ui/utils/Date.utils';
import {
  Account as AccountPrismaModel,
  $Enums as PrismaEnums,
} from '@prisma/client';
import { noop } from 'lodash';
import { ChevronDownCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface FinanceTrackerExpenseTabProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsContent>, 'value'> {}

export const FinanceTrackerExpenseTab = ({
  ...props
}: FinanceTrackerExpenseTabProps): JSX.Element => {
  const { currDate } = useDashboard();
  const { isEditMode, options, saveChanges, setFieldValue, transaction } =
    useFinanceTracker();
  const [inProgressDateValue, setInProgressDateValue] = useState<string>('');

  const handleSave = async (): Promise<void> => {
    setFieldValue('type', PrismaEnums.TransactionTypeEnum.EXPENSE);
    saveChanges();
  };

  const handlePaymentMethodChange = (value: number | string): void =>
    setFieldValue(FinanceTrackerInputNames.PAYMENT_METHOD, value);

  const selectedAccount: AccountPrismaModel | undefined = useMemo(
    () =>
      options?.accounts.find(
        (account: AccountPrismaModel) => account.id === transaction.accountId,
      ),
    [transaction.accountId],
  );

  const handleDateChange = (value: string): void =>
    setInProgressDateValue(value);
  const handleDateBlur = (): void => {
    const date = new Date(`${inProgressDateValue}T00:00:00`);
    date.setDate(15);

    if (isNaN(date.getTime())) return;

    setFieldValue(FinanceTrackerInputNames.BILLING_DATE, date);
  };

  const value = transaction.getBillingDateString();

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
      <FinanceTrackerInput
        defaultValue={value}
        disabled={
          transaction.paymentMethod !==
            PrismaEnums.PaymentMethodEnum.CREDIT_CARD || !selectedAccount
        }
        label="Billing date"
        name={FinanceTrackerInputNames.BILLING_DATE}
        onBlur={handleDateBlur}
        onChange={handleDateChange}
        type="date"
      />
      <FinanceTrackerSharedFooterInputs />
      <Button className="mt-5 w-full" onClick={handleSave}>
        {isEditMode ? 'Edit' : 'Add'} Expense
      </Button>
    </TabsContent>
  );
};
