import {
  Account as AccountPrismaModel,
  TransactionCategory as TransactionCategoryPrismaModel,
} from '@prisma/client';

export interface FinanceTrackerOptionsDto {
  accounts: AccountPrismaModel[];
  expenseCategories: TransactionCategoryPrismaModel[];
  incomeCategories: TransactionCategoryPrismaModel[];
  tags: Record<string, string[]>;
  transactionCategories: TransactionCategoryPrismaModel[];
}
