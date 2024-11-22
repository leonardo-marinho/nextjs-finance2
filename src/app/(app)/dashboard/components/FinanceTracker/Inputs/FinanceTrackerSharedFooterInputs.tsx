import {
  FinanceTrackerInputNames,
  repeatTypesSelectItems,
} from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerInput } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerInput';
import { FinanceTrackerSelect } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSelect';
import { FinanceTrackerSwitch } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSwitch';
import { FinanceTrackerTextarea } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerTextarea';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { $Enums as PrismaEnums } from '@prisma/client';
import { useMemo } from 'react';

export const FinanceTrackerSharedFooterInputs = (): JSX.Element => {
  const { setFieldValue, transaction } = useFinanceTracker();

  const handleRepeatTypeChange = (value: number | string): void =>
    setFieldValue(FinanceTrackerInputNames.REPEAT_TYPE, value);
  const handleNotesChange = (value: string): void =>
    setFieldValue(FinanceTrackerInputNames.NOTES, value);
  const handleIgnoreChange = (value: boolean): void =>
    setFieldValue(FinanceTrackerInputNames.IGNORE, value);
  const handleInstallmentsChange = (value: string): void =>
    setFieldValue(FinanceTrackerInputNames.INSTALLMENTS, Number(value));

  const disableInstallmentField = useMemo(
    () =>
      transaction.repeatType === PrismaEnums.TransactionRepeatEnum.NONE ||
      !!transaction.id,
    [transaction],
  );

  return (
    <>
      {transaction.type !== PrismaEnums.TransactionTypeEnum.TRANSFER && (
        <div className="flex gap-2">
          <FinanceTrackerSelect
            data={repeatTypesSelectItems}
            defaultValue={transaction.repeatType}
            label="Repeat"
            name={FinanceTrackerInputNames.REPEAT_TYPE}
            onChange={handleRepeatTypeChange}
            placeholder="Select repeat option"
          />
          <FinanceTrackerInput
            defaultValue={
              !transaction.repeatInstallments
                ? ''
                : transaction.repeatInstallments.toString()
            }
            disabled={disableInstallmentField}
            label="Installments"
            name={FinanceTrackerInputNames.INSTALLMENTS}
            onChange={handleInstallmentsChange}
            placeholder="Enter installments"
            type="number"
          />
        </div>
      )}
      <FinanceTrackerTextarea
        defaultValue={transaction.notes || ''}
        label="Notes"
        name={FinanceTrackerInputNames.NOTES}
        onChange={handleNotesChange}
        placeholder="Enter notes"
      />
      <FinanceTrackerSwitch
        defaultChecked={!!transaction.ignore}
        label="Ignore"
        name={FinanceTrackerInputNames.IGNORE}
        onChange={handleIgnoreChange}
      />
    </>
  );
};
