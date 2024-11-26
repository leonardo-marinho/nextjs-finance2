import { TransactionService } from '@/lib/server/services/Transaction.service';
import {
  AccountBalance,
  BalanceBiDto,
} from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import {
  $Enums as PrismaEnums,
  Transaction as TransactionPrismaModel,
} from '@prisma/client';

export class BiService {
  static getAccountsBalance(
    transactions: TransactionModel[],
    filter: (transaction: TransactionModel) => boolean,
  ): AccountBalance[] {
    const balanceMap = transactions.reduce(
      (map: Map<number, AccountBalance>, transaction: TransactionModel) => {
        if (!filter(transaction) || !transaction.Account?.name) return map;

        const accountId = transaction.Account.id;
        const balance = map.get(accountId)?.balance || 0;
        map.set(accountId, {
          balance: balance + transaction.amount,
          id: accountId,
          name: transaction.Account.name,
        });

        return map;
      },
      new Map<number, AccountBalance>(),
    );

    return Array.from(
      balanceMap,
      ([, { balance, id, name }]: [number, AccountBalance]) =>
        ({ balance, id, name }) as AccountBalance,
    ).sort((a: AccountBalance, b: AccountBalance) =>
      a.name.localeCompare(b.name),
    );
  }

  static async getBalanceBi(date: Date, userId: number): Promise<BalanceBiDto> {
    const [currMonthTransactions, prevMonthTransactions] =
      await this.getTransactions(date, userId);

    const creditCardsBalance: AccountBalance[] = this.getAccountsBalance(
      currMonthTransactions,
      (transaction: TransactionModel) => transaction.isCreditCardTransaction(),
    );
    const bankAccountsBalance: AccountBalance[] = this.getAccountsBalance(
      currMonthTransactions,
      (transaction: TransactionModel) => !transaction.isCreditCardTransaction(),
    );

    const firstDayOfCurrMonth: Date = new Date(
      date.getFullYear(),
      date.getMonth(),
    );
    const prevMonthBalance: number = this.sumAccountsBalance(
      this.getAccountsBalance(
        prevMonthTransactions,
        (transaction: TransactionPrismaModel) => {
          if (
            transaction.paymentMethod !==
              PrismaEnums.PaymentMethodEnum.CREDIT_CARD ||
            !transaction.billingDate
          )
            return true;

          return transaction.billingDate < firstDayOfCurrMonth;
        },
      ),
    );
    const currMonthIncome: number = this.sumAccountsBalance(
      this.getAccountsBalance(
        currMonthTransactions,
        (transaction: TransactionModel) => transaction.isIncome(),
      ),
    );
    const currMonthExpense: number = this.sumAccountsBalance([
      ...this.getAccountsBalance(
        currMonthTransactions,
        (transaction: TransactionModel) =>
          transaction.isExpense() && !transaction.isCreditCardTransaction(),
      ),
      ...this.getAccountsBalance(
        prevMonthTransactions,
        (transaction: TransactionModel) =>
          transaction.isExpense() && transaction.isCreditCardTransaction(),
      ),
    ]);
    const currMonthBalance: number =
      prevMonthBalance + currMonthIncome + currMonthExpense;

    return {
      accounts: bankAccountsBalance,
      creditCards: creditCardsBalance,
      currMonthBalance,
      currMonthExpense,
      currMonthIncome,
      prevMonthBalance,
    } as BalanceBiDto;
  }

  static async getTransactions(
    date: Date,
    userId: number,
  ): Promise<[TransactionModel[], TransactionModel[]]> {
    const resetDate: Date = new Date(date);
    resetDate.setHours(0, 0, 0, 0);

    const currMonthTransactions: TransactionPrismaModel[] =
      await TransactionService.getTransactionsByMonth(date, userId);
    const firstDayOfCurrMonth: Date = new Date(
      date.getFullYear(),
      date.getMonth(),
    );
    const prevMonthTransactions: TransactionPrismaModel[] =
      await TransactionService.getTransactionsUntilDate(
        firstDayOfCurrMonth,
        userId,
      );

    return [currMonthTransactions, prevMonthTransactions] as [
      TransactionModel[],
      TransactionModel[],
    ];
  }

  static sumAccountsBalance(accounts: AccountBalance[]): number {
    return accounts.reduce(
      (sum: number, account: AccountBalance) => sum + account.balance,
      0,
    );
  }
}
