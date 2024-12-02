import { ArrayType } from '@/lib/shared/types/Array';
import { Button } from '@/lib/ui/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/ui/components/DropdownMenu';
import { Label } from '@/lib/ui/components/Label';
import { Switch } from '@/lib/ui/components/Switch';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { Prisma, $Enums as PrismaEnums } from '@prisma/client';
import { ArrowDown10, ArrowUp01, Filter, FilterX } from 'lucide-react';
import { useMemo } from 'react';

export const FinanceListFilter = (): JSX.Element => {
  const {
    financeListFilters,
    financeListPagination,
    hasFilters,
    resetListFilters,
    updateFinanceListFilters,
    updateFinanceListPagination,
  } = useDashboard();

  const dateSort = useMemo(
    () =>
      financeListPagination?.sort?.find(
        (sort: ArrayType<typeof financeListPagination.sort>) =>
          sort.field === 'date',
      ),
    [financeListPagination],
  );

  const handleFilterClearClick = (): void => resetListFilters();
  const handleIncomeFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({
      type: checked
        ? [
            ...(financeListFilters?.type || []),
            PrismaEnums.TransactionTypeEnum.INCOME,
          ]
        : financeListFilters?.type?.filter(
            (type: PrismaEnums.TransactionTypeEnum) =>
              type !== PrismaEnums.TransactionTypeEnum.INCOME,
          ),
    });
  const handleExpenseFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({
      type: checked
        ? [
            ...(financeListFilters?.type || []),
            PrismaEnums.TransactionTypeEnum.EXPENSE,
          ]
        : financeListFilters?.type?.filter(
            (type: PrismaEnums.TransactionTypeEnum) =>
              type !== PrismaEnums.TransactionTypeEnum.EXPENSE,
          ),
    });
  const handleRepeatFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({ repeatOnly: checked });
  const handlePlaceholderOnlyFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({ placeholderOnly: checked });
  const handleSortByClick = (): void => {
    const dateSort = financeListPagination?.sort?.find(
      (sort: ArrayType<typeof financeListPagination.sort>) =>
        sort.field === 'date',
    );
    updateFinanceListPagination({
      sort: [
        {
          field: 'date',
          order:
            dateSort?.order === Prisma.SortOrder.asc
              ? Prisma.SortOrder.desc
              : Prisma.SortOrder.asc,
        },
      ],
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        disabled={!hasFilters}
        onClick={handleFilterClearClick}
        size="icon"
        variant="outline"
      >
        <FilterX className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <Filter className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Income and Expense</DropdownMenuLabel>
          <DropdownMenuItem>
            <div className="flex flex-1 items-center gap-2">
              <Switch
                defaultChecked={financeListFilters?.type?.includes(
                  PrismaEnums.TransactionTypeEnum.INCOME,
                )}
                name="filter-type-income"
                onCheckedChange={handleIncomeFilterToggle}
              />
              <Label htmlFor="filter-type-income">Income</Label>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-1 items-center gap-2">
              <Switch
                defaultChecked={financeListFilters?.type?.includes(
                  PrismaEnums.TransactionTypeEnum.EXPENSE,
                )}
                name="filter-type-expense"
                onCheckedChange={handleExpenseFilterToggle}
              />
              <Label htmlFor="filter-type-expense">Expense</Label>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex flex-1 items-center gap-2">
              <Switch
                defaultChecked={!!financeListFilters?.repeatOnly}
                name="filter-repeat-only"
                onCheckedChange={handleRepeatFilterToggle}
              />
              <Label htmlFor="filter-repeat-only">Repeat only</Label>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-1 items-center gap-2">
              <Switch
                defaultChecked={!!financeListFilters?.placeholderOnly}
                name="filter-repeat-only"
                onCheckedChange={handlePlaceholderOnlyFilterToggle}
              />
              <Label htmlFor="filter-repeat-only">Placeholder only</Label>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleSortByClick} size="icon" variant="outline">
        {dateSort?.order === Prisma.SortOrder.asc ? (
          <ArrowUp01 className="size-4" />
        ) : (
          <ArrowDown10 className="size-4" />
        )}
      </Button>
    </div>
  );
};
