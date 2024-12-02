import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export interface AccountBalance {
  balance: number;
  id: number;
  name: string;
}

export interface BalanceBiDto {
  accountsBalance: AccountBalance[];
  accountsExpense: number;
  accountsIncome: number;
  balance: number;
  billableBalance: number;
  billableCreditCardsBalance: AccountBalance[];
  billableCreditCardsExpense: number;
  creditCardsBalance: AccountBalance[];
  creditCardsExpense: number;
  prevMonthBalanceBi: Pick<
    BalanceBiDto,
    | 'balance'
    | 'billableBalance'
    | 'totalBillableExpense'
    | 'totalBillableIncome'
    | 'totalExpense'
    | 'totalIncome'
  >;
  totalBillableExpense: number;
  totalBillableIncome: number;
  totalExpense: number;
  totalIncome: number;
}

export class BiGetBalanceBiParamsDto {
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  date: Date;
}
