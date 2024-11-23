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

export const FinanceListFilter = (): JSX.Element => {
  const {
    financeListFilters,
    hasFilters,
    resetListFilters,
    updateFinanceListFilters,
  } = useDashboard();

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
  const handleCreditCardFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({
      paymentMethod: checked
        ? [
            ...(financeListFilters?.paymentMethod || []),
            PrismaEnums.PaymentMethodEnum.CREDIT_CARD,
          ]
        : financeListFilters?.paymentMethod?.filter(
            (method: PrismaEnums.PaymentMethodEnum) =>
              method !== PrismaEnums.PaymentMethodEnum.CREDIT_CARD,
          ),
    });
  const handleAccountFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({
      paymentMethod: checked
        ? [
            ...(financeListFilters?.paymentMethod || []),
            PrismaEnums.PaymentMethodEnum.ACCOUNT,
          ]
        : financeListFilters?.paymentMethod?.filter(
            (method: PrismaEnums.PaymentMethodEnum) =>
              method !== PrismaEnums.PaymentMethodEnum.ACCOUNT,
          ),
    });
  const handleRepeatFilterToggle = (checked: boolean): void =>
    updateFinanceListFilters({ repeatOnly: checked });
  const handleSortByClick = (): void =>
    updateFinanceListFilters({
      sortOrder:
        financeListFilters?.sortOrder === Prisma.SortOrder.asc
          ? Prisma.SortOrder.desc
          : Prisma.SortOrder.asc,
    });

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
          <DropdownMenuLabel>Payment Method</DropdownMenuLabel>
          <DropdownMenuItem>
            <div className="flex flex-1 items-center gap-2">
              <Switch
                defaultChecked={financeListFilters?.paymentMethod?.includes(
                  PrismaEnums.PaymentMethodEnum.CREDIT_CARD,
                )}
                name="filter-payment-credit-card"
                onCheckedChange={handleCreditCardFilterToggle}
              />
              <Label htmlFor="filter-payment-credit-card">Credit card</Label>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-1 items-center gap-2">
              <Switch
                defaultChecked={financeListFilters?.paymentMethod?.includes(
                  PrismaEnums.PaymentMethodEnum.ACCOUNT,
                )}
                name="filter-payment-account"
                onCheckedChange={handleAccountFilterToggle}
              />
              <Label htmlFor="filter-payment-account">Account</Label>
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
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleSortByClick} size="icon" variant="outline">
        {financeListFilters?.sortOrder === Prisma.SortOrder.asc ? (
          <ArrowUp01 className="size-4" />
        ) : (
          <ArrowDown10 className="size-4" />
        )}
      </Button>
    </div>
  );
};
