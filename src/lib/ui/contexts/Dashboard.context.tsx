'use client';
import { GetTransactionsParamsDto } from '@/lib/shared/dtos/GetTransactionsParams.dto';
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
  useState,
} from 'react';

const DEFAULT_FILTERS: GetTransactionsParamsDto = {
  paymentMethod: [
    PrismaEnums.PaymentMethodEnum.CREDIT_CARD,
    PrismaEnums.PaymentMethodEnum.ACCOUNT,
  ],
  type: [
    PrismaEnums.TransactionTypeEnum.EXPENSE,
    PrismaEnums.TransactionTypeEnum.INCOME,
  ],
};

export interface DashboardContextData {
  balanceBiQuery: null | ReturnType<
    // @ts-expect-error - required to be fixed
    typeof useApi<typeof BiApiService.getBalanceBi>
  >;
  currDate: Date;
  financeListFilters: GetTransactionsParamsDto | null;
  hasFilters?: boolean;
  reloadDashboardData: () => void;
  resetFilters: () => void;
  resetListFilters: (startDate?: Date, endDate?: Date) => void;
  transactionsQuery: null | ReturnType<
    typeof useApi<typeof TransactionApiService.getTransactions>
  >;
  updateFinanceListFilters: (
    filters: SetStateAction<GetTransactionsParamsDto>,
  ) => void;
}

export const DashboardContext = createContext<DashboardContextData>({
  balanceBiQuery: null,
  currDate: new Date(),
  financeListFilters: null,
  hasFilters: false,
  reloadDashboardData: noop,
  resetFilters: noop,
  resetListFilters: noop,
  transactionsQuery: null,
  updateFinanceListFilters: noop,
});

interface DashboardProviderProps extends React.PropsWithChildren {}

export const DashboardProvider = ({
  children,
}: DashboardProviderProps): JSX.Element => {
  const [currDate] = useState(new Date());
  const [hasFilters, setHasFilters] = useState<boolean>(false);
  const [transactionsFilters, setTransactionsFilters] =
    useState<GetTransactionsParamsDto>();

  const balanceBiQuery = useApi({
    fn: () =>
      BiApiService.getBalanceBi({
        date: transactionsFilters?.endDate || currDate,
      }),
    options: {
      lazy: true,
    },
  });

  const transactionsQuery = useApi({
    fn: () => TransactionApiService.getTransactions(transactionsFilters),
    options: {
      lazy: true,
    },
  });

  useEffect(() => {
    resetFilters();
    balanceBiQuery.request({} as never);
  }, []);

  useEffect(() => {
    if (!transactionsFilters) return;

    reloadDashboardData();
  }, [transactionsFilters]);

  const reloadDashboardData = (): void => {
    balanceBiQuery.request({} as never);
    transactionsQuery.request({} as never);
  };

  const updateFinanceListFilters = (
    filters: SetStateAction<GetTransactionsParamsDto>,
  ): void => {
    const newFilters: GetTransactionsParamsDto = {
      ...transactionsFilters,
      ...filters,
    };
    setTransactionsFilters(newFilters);
    setHasFilters(true);
  };

  const resetListFilters = (startDate?: Date, endDate?: Date): void => {
    setHasFilters(false);
    setTransactionsFilters({
      endDate: endDate || transactionsFilters?.endDate,
      startDate: startDate || transactionsFilters?.startDate,
      ...DEFAULT_FILTERS,
    });
  };

  const resetFilters = useCallback(() => {
    const [startDate, endDate] = getStartEndDatesByMonth(
      currDate.getMonth() + 1,
      currDate.getFullYear(),
    );
    resetListFilters(startDate, endDate);
  }, [currDate]);

  return (
    <DashboardContext.Provider
      value={{
        // @ts-expect-error - required to be fixed
        balanceBiQuery,
        currDate,
        financeListFilters: transactionsFilters || null,
        hasFilters,
        reloadDashboardData,
        resetFilters,
        resetListFilters,
        transactionsQuery,
        updateFinanceListFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
