import { FinanceTrackerInputNames } from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerComboBox } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerComboBox';
import { FinanceTrackerInput } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerInput';
import { FinanceTrackerSelect } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSelect';
import { Button } from '@/lib/ui/components/Button';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { SelectItemDataValue } from '@/lib/ui/types/Select';
import { useMemo, useState } from 'react';

export const FinanceTrackerSharedInputs = () => {
  const {
    optionsSelectItems,
    setFieldsValues,
    setFieldValue,
    transaction,
    updateUI,
  } = useFinanceTracker();
  const [inProgressDateValue, setInProgressDateValue] = useState<string>('');

  const handleSetTodayClick = (): void => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    setInProgressDateValue(todayString);
    setFieldValue(FinanceTrackerInputNames.DATE, today);
    updateUI();
  };

  const handleDateChange = (value: string): void =>
    setInProgressDateValue(value);
  const handleDateBlur = (): void => {
    const date = new Date(`${inProgressDateValue}T00:00:00`);

    if (isNaN(date.getTime())) return;

    setFieldValue(FinanceTrackerInputNames.DATE, date);
  };
  const handleTagsChange = (tags: string, categoryId?: string): void => {
    setFieldsValues<number | string>([
      { field: FinanceTrackerInputNames.TAGS, value: tags },
      { field: FinanceTrackerInputNames.CATEGORY, value: Number(categoryId) },
    ]);
    updateUI();
  };
  const handleCategoryChange = (value: SelectItemDataValue): void => {
    setFieldValue(FinanceTrackerInputNames.CATEGORY, Number(value));
  };
  const handleAccountChange = (value: SelectItemDataValue): void =>
    setFieldValue(FinanceTrackerInputNames.ACCOUNT, Number(value));
  const handleAmountChange = (value: string): void => {
    setFieldValue(FinanceTrackerInputNames.AMOUNT, Number(value));
  };

  const date = useMemo(
    () => transaction.getDateString(),
    [transaction, transaction.date],
  );

  return (
    <>
      <div className="flex items-end gap-1">
        <FinanceTrackerInput
          defaultValue={date}
          label="Date"
          name={FinanceTrackerInputNames.DATE}
          onBlur={handleDateBlur}
          onChange={handleDateChange}
          type="date"
        />
        <Button className="w-1/6" onClick={handleSetTodayClick}>
          Hoje
        </Button>
      </div>
      <FinanceTrackerComboBox
        defaultValue={transaction.tags || ''}
        label="Tags"
        name={FinanceTrackerInputNames.TAGS}
        onChange={handleTagsChange}
        placeholder="Enter tags (comma-separated)"
      />
      <FinanceTrackerSelect
        data={optionsSelectItems?.categories}
        label="Category"
        name={FinanceTrackerInputNames.CATEGORY}
        onChange={handleCategoryChange}
        placeholder="Select category"
        value={
          !!transaction.categoryId ? `${transaction.categoryId}` : undefined
        }
      />
      <div className="flex gap-2">
        <FinanceTrackerSelect
          data={optionsSelectItems?.accounts}
          defaultValue={
            !!transaction.accountId ? String(transaction.accountId) : undefined
          }
          label="Account"
          name={FinanceTrackerInputNames.ACCOUNT}
          onChange={handleAccountChange}
          placeholder="Select account"
        />
        <FinanceTrackerInput
          defaultValue={
            !transaction.amount ? '' : Math.abs(transaction.amount).toString()
          }
          label="Amount"
          name={FinanceTrackerInputNames.AMOUNT}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          type="number"
        />
      </div>
    </>
  );
};
