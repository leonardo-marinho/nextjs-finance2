import { FinanceTrackerInputNames } from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerComboBox } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerComboBox';
import { FinanceTrackerInput } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerInput';
import { FinanceTrackerSelect } from '@/app/(app)/dashboard/components/FinanceTracker/Inputs/FinanceTrackerSelect';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { SelectItemDataValue } from '@/lib/ui/types/Select';
import { useState } from 'react';

export const FinanceTrackerSharedInputs = (): JSX.Element => {
  const [inProgressDateValue, setInProgressDateValue] = useState<string>('');
  const { optionsSelectItems, setFieldValue, transaction } =
    useFinanceTracker();

  const handleDateChange = (value: string): void =>
    setInProgressDateValue(value);
  const handleDateBlur = (): void => {
    const date = new Date(`${inProgressDateValue}T00:00:00`);

    if (isNaN(date.getTime())) return;

    setFieldValue(FinanceTrackerInputNames.DATE, date);
  };
  const handleTagsChange = (value: string): void =>
    setFieldValue(FinanceTrackerInputNames.TAGS, value);
  const handleCategoryChange = (value: SelectItemDataValue): void =>
    setFieldValue(FinanceTrackerInputNames.CATEGORY, Number(value));
  const handleAccountChange = (value: SelectItemDataValue): void =>
    setFieldValue(FinanceTrackerInputNames.ACCOUNT, Number(value));
  const handleAmountChange = (value: string): void => {
    setFieldValue(FinanceTrackerInputNames.AMOUNT, Number(value));
  };

  return (
    <>
      <FinanceTrackerInput
        defaultValue={transaction.getDateString()}
        label="Date"
        name={FinanceTrackerInputNames.DATE}
        onBlur={handleDateBlur}
        onChange={handleDateChange}
        type="date"
      />
      <FinanceTrackerComboBox
        defaultValue={transaction.tags || ''}
        label="Tags"
        name={FinanceTrackerInputNames.TAGS}
        onCategoryChange={(category: string) => handleCategoryChange(category)}
        onTagsChange={handleTagsChange}
        placeholder="Enter tags (comma-separated)"
      />
      <FinanceTrackerSelect
        data={optionsSelectItems?.categories}
        defaultValue={
          !!transaction.categoryId ? `${transaction.categoryId}` : undefined
        }
        label="Category"
        name={FinanceTrackerInputNames.CATEGORY}
        onChange={handleCategoryChange}
        placeholder="Select category"
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
