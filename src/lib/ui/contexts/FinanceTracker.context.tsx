'use client';
import { financeTrackerTabs } from '@/app/(app)/dashboard/components/FinanceTracker/constants';
import { FinanceTrackerOptionsDto } from '@/lib/shared/dtos/FinanceTrackerOptions.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { TransactionEditModel } from '@/lib/shared/models/TransactionEdit.model';
import { ArrayType } from '@/lib/shared/types/Array';
import { useApi } from '@/lib/ui/hooks/useApi';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { usePromise } from '@/lib/ui/hooks/usePromise';
import FinanceTrackerApiService from '@/lib/ui/services/FinanceTrackerApi.service';
import { SelectItemData } from '@/lib/ui/types/Select';
import {
  Account as AccountPrismaModel,
  $Enums as PrismaEnums,
  TransactionCategory as TransactionCategoryPrismaModel,
  Transaction as TransactionPrismaModel,
} from '@prisma/client';
import { noop } from 'lodash';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface FinanceTrackerContextOptions {
  accounts: AccountPrismaModel[];
  categories: TransactionCategoryPrismaModel[];
}

export type FinanceTrackerFieldNameType =
  | 'repeatInstallments'
  | 'repeatType'
  | 'transferAccountId'
  | keyof TransactionPrismaModel;

export interface FinanceTrackerContextData {
  cloneTransaction: (transaction: TransactionModel) => void;
  deleteTransaction: (id: number) => void;
  editTransaction: (transaction: TransactionModel) => void;
  isEditMode: boolean;
  isUpdatingUI: boolean;
  options: FinanceTrackerOptionsDto | null;
  optionsSelectItems: null | Record<
    keyof FinanceTrackerContextOptions,
    SelectItemData[]
  >;
  resetTransaction: () => void;
  saveChanges: () => void;
  setFieldValue: (
    name: FinanceTrackerFieldNameType,
    value: boolean | number | object | string,
    forceUpdateUI?: boolean,
  ) => void;
  setKeepTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFinanceTrackerPanel: React.Dispatch<React.SetStateAction<boolean>>;
  showFinanceTrackerPanel: boolean;
  tab: string;
  transaction: TransactionEditModel;
  updateTab: (tabName: PrismaEnums.TransactionTypeEnum) => void;
}

export const FinanceTrackerContext = createContext<FinanceTrackerContextData>({
  cloneTransaction: noop,
  deleteTransaction: noop,
  editTransaction: noop,
  isEditMode: false,
  isUpdatingUI: false,
  options: null,
  optionsSelectItems: null,
  resetTransaction: noop,
  saveChanges: noop,
  setFieldValue: noop,
  setKeepTemplate: noop,
  setShowFinanceTrackerPanel: noop,
  showFinanceTrackerPanel: false,
  tab: financeTrackerTabs.INCOMING,
  transaction: new TransactionEditModel(),
  updateTab: noop,
});

interface FinanceTrackerProviderProps extends React.PropsWithChildren {}

export const FinanceTrackerProvider = ({
  children,
}: FinanceTrackerProviderProps): JSX.Element => {
  const { reloadDashboardData } = useDashboard();

  const [tab, setTab] = useState<string>(financeTrackerTabs.INCOME);
  const [, setKeepTemplate] = useState<boolean>(true);
  const [showFinanceTrackerPanel, setShowFinanceTrackerPanel] =
    useState<boolean>(false);
  const [transaction, setTransaction] = useState<TransactionEditModel>(
    new TransactionEditModel(),
  );

  const isEditMode = useMemo(() => transaction.id > 0, [transaction.id]);

  const { isPending: isUpdatingUI, promise: updateUI } = usePromise(
    () =>
      new Promise((resolve: (value: PromiseLike<void> | void) => void) =>
        setTimeout(() => {
          resolve();
        }, 200),
      ),
    {
      lazy: true,
    },
  );

  const { data: options } = useApi({
    fn: FinanceTrackerApiService.getOptions.bind(FinanceTrackerApiService),
  });

  const { requestAsync: createTransactionRequest } = useApi({
    fn: () => FinanceTrackerApiService.createTransaction(transaction),
    options: { lazy: true },
  });

  const { requestAsync: updateTransactionRequest } = useApi({
    fn: () =>
      FinanceTrackerApiService.updateTransaction(
        { id: transaction.id },
        transaction,
      ),
    options: { lazy: true },
  });

  const { requestAsync: deleteTransactionRequest } = useApi({
    fn: (params: IdQueryDto) =>
      FinanceTrackerApiService.deleteTransaction(params),
    options: { lazy: true },
  });

  const optionsSelectItems: null | Record<
    keyof FinanceTrackerContextOptions,
    SelectItemData[]
  > = useMemo(() => {
    let categoryType: keyof FinanceTrackerOptionsDto;

    if (transaction.type === PrismaEnums.TransactionTypeEnum.INCOME)
      categoryType = 'incomeCategories';
    else if (transaction.type === PrismaEnums.TransactionTypeEnum.EXPENSE)
      categoryType = 'expenseCategories';
    else categoryType = 'transactionCategories';

    return !options
      ? null
      : {
          accounts: options.accounts.map(
            (account: ArrayType<FinanceTrackerOptionsDto['accounts']>) => ({
              label: account.name,
              value: String(account.id),
            }),
          ),
          categories: options[categoryType].map(
            (category: TransactionCategoryPrismaModel) => ({
              label: category.name,
              value: String(category.id),
            }),
          ),
        };
  }, [options, transaction.type]);

  const setFieldValue = <TValue,>(
    name: FinanceTrackerFieldNameType,
    value: TValue,
    forceUpdateUI: boolean = false,
  ): void => {
    const templateTransaction = new TransactionEditModel(transaction);
    // @ts-expect-error - TS doesn't know that transaction is a TransactionEditModel
    templateTransaction[name] = value;
    setTransaction(templateTransaction);

    if (forceUpdateUI) updateUI();
  };

  const saveChanges = async (): Promise<void> => {
    let response: Awaited<
      ReturnType<
        | typeof FinanceTrackerApiService.createTransaction
        | typeof FinanceTrackerApiService.updateTransaction
      >
    >;

    if (transaction.id)
      // @ts-expect-error - TS doesn't know that transaction is a TransactionEditModel
      response = await updateTransactionRequest();
    // @ts-expect-error - TS doesn't know that transaction is a TransactionEditModel
    else response = await createTransactionRequest();

    if (!response.result) {
      toast.error('Failed to save changes');

      return;
    }

    toast.success('Changes saved successfully');

    cloneTransaction(transaction);
    updateUI();
    reloadDashboardData();
  };

  const cloneTransaction = (transaction: TransactionModel): void => {
    const templateTransaction = new TransactionEditModel();
    templateTransaction.accountId = transaction.accountId;
    templateTransaction.date = transaction.date;
    templateTransaction.type = transaction.type;
    templateTransaction.categoryId = transaction.categoryId;
    templateTransaction.paymentMethod = transaction.paymentMethod;
    templateTransaction.tags = transaction.tags;
    setTransaction(templateTransaction);
    setTab(templateTransaction.type);
    updateUI();
  };

  const editTransaction = (transaction: TransactionModel): void => {
    const templateTransaction = new TransactionEditModel(transaction);
    setTransaction(templateTransaction);
    setTab(templateTransaction.type);
    updateUI();
  };

  const resetTransaction = (): void => {
    const templateTransaction = new TransactionEditModel();
    setTransaction(templateTransaction);
  };

  const deleteTransaction = async (id: number): Promise<void> => {
    const response = (await toast.promise(deleteTransactionRequest({ id }), {
      pending: 'Deleting transaction...',
    })) as Awaited<
      ReturnType<typeof FinanceTrackerApiService.deleteTransaction>
    >;

    if (response.result) {
      toast.success('Transaction deleted successfully');
      reloadDashboardData();
    } else toast.error('Transaction failed to delete');
  };

  const updateTab = (type?: PrismaEnums.TransactionTypeEnum): void => {
    setTab(type || transaction.type);
    resetTransaction();
    const templateTransaction = new TransactionEditModel();

    if (type) templateTransaction.type = type;

    setTransaction(templateTransaction);
    updateUI();
  };

  useEffect(() => {
    if (transaction.type !== tab) updateTab(transaction.type);
  }, [transaction.type]);

  return (
    <FinanceTrackerContext.Provider
      value={{
        cloneTransaction,
        deleteTransaction,
        editTransaction,
        isEditMode,
        isUpdatingUI,
        options: options || null,
        optionsSelectItems,
        resetTransaction,
        saveChanges,
        setFieldValue,
        setKeepTemplate,
        setShowFinanceTrackerPanel,
        showFinanceTrackerPanel,
        tab,
        transaction,
        updateTab,
      }}
    >
      {children}
    </FinanceTrackerContext.Provider>
  );
};
