'use client';
import {
  GetTransactionsParamsDto,
  TransactionsFilters,
} from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { getStartEndDatesByMonth } from '@/lib/shared/utils/Date.utils';
import { useApi } from '@/lib/ui/hooks/useApi';
import BiApiService from '@/lib/ui/services/BiApi.service';
import TransactionApiService from '@/lib/ui/services/TransactionApi.service';
import { $Enums as PrismaEnums } from '@prisma/client';
import { noop } from 'lodash';
import React, {
  createContext,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const DEFAULT_ACCOUNT_PAYMENT_METHOD_FILTER = (
  startDate?: Date,
  endDate?: Date,
): TransactionsFilters =>
  ({
    endDate,
    paymentMethod: [PrismaEnums.PaymentMethodEnum.ACCOUNT],
    startDate,
  }) as TransactionsFilters;

export const DEFAULT_CREDIT_CARD_PAYMENT_METHOD_FILTER = (
  startDate?: Date,
  endDate?: Date,
): TransactionsFilters =>
  ({
    billableEndDate: endDate,
    billableStartDate: startDate,
    paymentMethod: [PrismaEnums.PaymentMethodEnum.CREDIT_CARD],
  }) as TransactionsFilters;

const DEFAULT_FILTERS = (
  startDate?: Date,
  endDate?: Date,
): TransactionsFilters => ({
  or: [
    DEFAULT_ACCOUNT_PAYMENT_METHOD_FILTER(startDate, endDate),
    DEFAULT_CREDIT_CARD_PAYMENT_METHOD_FILTER(startDate, endDate),
  ],
  type: [
    PrismaEnums.TransactionTypeEnum.EXPENSE,
    PrismaEnums.TransactionTypeEnum.INCOME,
  ],
});

export interface DashboardContextData {
  balanceBiQuery: null | ReturnType<
    // @ts-expect-error - required to be fixed
    typeof useApi<typeof BiApiService.getBalanceBi>
  >;
  currDate: Date;
  endDate: Date | undefined;
  financeListFilters: GetTransactionsParamsDto['filters'];
  financeListPagination: GetTransactionsParamsDto['pagination'];
  financeListTab: string;
  hasFilters?: boolean;
  reloadDashboardData: () => void;
  resetFilters: () => void;
  resetListFilters: () => void;
  resetListPagination: () => void;
  resetPagination: () => void;
  startDate: Date | undefined;
  transactionsQuery: null | ReturnType<
    typeof useApi<typeof TransactionApiService.getTransactions>
  >;
  updateFinanceListFilters: (
    filters: SetStateAction<GetTransactionsParamsDto['filters']>,
  ) => void;
  updateFinanceListPagination: (
    pagination: GetTransactionsParamsDto['pagination'],
  ) => void;
  updateFinanceListTab: (tabName: string) => void;
  updateRefDate: (date: Date) => void;
}

export const DashboardContext = createContext<DashboardContextData>({
  balanceBiQuery: null,
  currDate: new Date(),
  endDate: undefined,
  financeListFilters: undefined,
  financeListPagination: undefined,
  financeListTab: 'account',
  hasFilters: false,
  reloadDashboardData: noop,
  resetFilters: noop,
  resetListFilters: noop,
  resetListPagination: noop,
  resetPagination: noop,
  startDate: undefined,
  transactionsQuery: null,
  updateFinanceListFilters: noop,
  updateFinanceListPagination: noop,
  updateFinanceListTab: noop,
  updateRefDate: noop,
});

interface DashboardProviderProps extends React.PropsWithChildren {}

export const DashboardProvider = ({
  children,
}: DashboardProviderProps): JSX.Element => {
  const [currDate] = useState(new Date());
  const [refDate, setRefDate] = useState<Date>(currDate);
  const [hasFilters, setHasFilters] = useState<boolean>(false);
  const [transactionsFilters, setTransactionsFilters] =
    useState<GetTransactionsParamsDto['filters']>();
  const [transactionsPagination, setTransactionsPagination] =
    useState<GetTransactionsParamsDto['pagination']>();
  const [financeListTab, setFinanceListTab] = useState<string>('account');

  const [startDate, endDate] = useMemo(
    () =>
      getStartEndDatesByMonth(refDate.getMonth() + 1, refDate.getFullYear()),
    [refDate],
  );

  const balanceBiQuery = useApi({
    fn: () =>
      BiApiService.getBalanceBi({
        date: refDate,
      }),
    options: {
      lazy: true,
    },
  });

  const transactionsQuery = useApi({
    fn: () =>
      TransactionApiService.getTransactions({
        filters: transactionsFilters,
        pagination: transactionsPagination,
      }),
    options: {
      lazy: true,
    },
  });

  useEffect(() => {
    resetFilters();
    resetListPagination();
    balanceBiQuery.request({} as never);
  }, []);

  useEffect(() => {
    updateFinanceListFilters(DEFAULT_FILTERS(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    if (!transactionsFilters) return;

    reloadDashboardData();
  }, [transactionsFilters, transactionsPagination]);

  const reloadDashboardData = (): void => {
    balanceBiQuery.request({} as never);
    transactionsQuery.request({} as never);
  };

  const updateFinanceListFilters = (
    filters: SetStateAction<typeof transactionsFilters>,
  ): void => {
    const newFilters: typeof transactionsFilters = {
      ...transactionsFilters,
      ...filters,
    };
    setTransactionsFilters(newFilters);
    setHasFilters(true);
  };

  const resetListFilters = (): void => {
    setHasFilters(false);
    setTransactionsFilters({
      ...DEFAULT_FILTERS(startDate, endDate),
    });
  };

  const updateFinanceListPagination = (
    pagination: typeof transactionsPagination,
  ): void => {
    if (pagination?.sort) {
      pagination.sort = [
        ...pagination.sort,
        ...(transactionsPagination?.sort || []),
      ];
    }

    setTransactionsPagination({
      ...transactionsPagination,
      ...pagination,
    });
  };

  const resetListPagination = (): void => {
    setTransactionsPagination({
      sort: [
        {
          field: 'date',
          order: 'desc',
        },
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    });
  };

  const resetFilters = useCallback(() => {
    resetListFilters();
  }, [currDate]);

  const updateRefDate = (date: Date): void => {
    setRefDate(date);
  };

  return (
    <DashboardContext.Provider
      value={{
        // @ts-expect-error - required to be fixed
        balanceBiQuery,
        currDate,
        endDate,
        financeListFilters: transactionsFilters,
        financeListPagination: transactionsPagination,
        financeListTab,
        hasFilters,
        reloadDashboardData,
        resetFilters,
        resetListFilters,
        resetListPagination,
        startDate,
        transactionsQuery,
        updateFinanceListFilters,
        updateFinanceListPagination,
        updateFinanceListTab: setFinanceListTab,
        updateRefDate,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
