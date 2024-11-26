import { FinanceTrackerFieldNameType } from '@/lib/ui/contexts/FinanceTracker.context';
import { SelectItemData } from '@/lib/ui/types/Select';
import { $Enums as PrismaEnums } from '@prisma/client';

export const FinanceTrackerInputNames: Record<
  string,
  FinanceTrackerFieldNameType
> = {
  ACCOUNT: 'accountId',
  AMOUNT: 'amount',
  BILLING_DATE: 'billingDate',
  CATEGORY: 'categoryId',
  DATE: 'date',
  IGNORE: 'ignore',
  INSTALLMENTS: 'repeatInstallments',
  NOTES: 'notes',
  PAYMENT_METHOD: 'paymentMethod',
  REPEAT_TYPE: 'repeatType',
  TAGS: 'tags',
  TRANSFER_ACCOUNT: 'transferAccountId',
};

export const financeTrackerTabs: Record<string, string> = {
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
};

export const repeatTypesSelectItems: SelectItemData[] = [
  { label: 'No repeat', value: PrismaEnums.TransactionRepeatEnum.NONE },
  {
    label: 'Weekly',
    value: PrismaEnums.TransactionRepeatEnum.WEEKLY,
  },
  {
    label: 'Monthly',
    value: PrismaEnums.TransactionRepeatEnum.MONTHLY,
  },
];
