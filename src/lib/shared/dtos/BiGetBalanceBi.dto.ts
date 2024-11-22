import { Transform } from "class-transformer";
import { IsDate } from "class-validator";

export interface AccountBalance {
  balance: number;
  id: number;
  name: string;
}

export interface BalanceBiDto {
  accounts: AccountBalance[];
  balance: number;
  creditCards: AccountBalance[];
  currMonthBalance: number;
  currMonthExpense: number;
  currMonthIncome: number;
  prevMonthBalance: number;
}

export class BiGetBalanceBiParamsDto {
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  date: Date;
}