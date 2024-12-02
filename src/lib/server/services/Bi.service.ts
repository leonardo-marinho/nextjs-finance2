import { TransactionService } from '@/lib/server/services/Transaction.service';
import {
  AccountBalance,
  BalanceBiDto,
} from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { addDays, lastDayOfMonth } from '@/lib/shared/utils/Date.utils';
import { $Enums as PrismaEnums } from '@prisma/client';
import { pick } from 'lodash';

export class BiService {
  static getAccountsBalance(
    transactions: TransactionModel[],
    filter: (transaction: TransactionModel) => boolean = () => true,
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

  static async getBalanceBi(
    userId: number,
    startDate: Date,
    endDate: Date,
    skipPrevMonth: boolean = false,
  ): Promise<BalanceBiDto> {
    let prevMonthBalanceBi: BalanceBiDto['prevMonthBalanceBi'] | null =
      skipPrevMonth
        ? null
        : pick(await this.getBalanceBi(userId, new Date(0), startDate, true), [
            'balance',
            'billableBalance',
            'totalBillableExpense',
            'totalBillableIncome',
            'totalExpense',
            'totalIncome',
          ]);

    const accountsTransactions: TransactionModel[] =
      await TransactionService.getTransactions(userId, {
        endDate,
        paymentMethod: [PrismaEnums.PaymentMethodEnum.ACCOUNT],
        startDate,
      });

    const currMonthCreditCardsTransactions: TransactionModel[] =
      await TransactionService.getTransactions(userId, {
        endDate,
        paymentMethod: [PrismaEnums.PaymentMethodEnum.CREDIT_CARD],
        startDate,
      });

    const billableCreditCardsTransactions: TransactionModel[] =
      await TransactionService.getTransactions(userId, {
        billableEndDate: endDate,
        billableStartDate: startDate,
        paymentMethod: [PrismaEnums.PaymentMethodEnum.CREDIT_CARD],
      });

    const accountsBalance: AccountBalance[] =
      this.getAccountsBalance(accountsTransactions);

    const billableCreditCardsBalance: AccountBalance[] =
      this.getAccountsBalance(billableCreditCardsTransactions);

    const creditCardsBalance: AccountBalance[] = this.getAccountsBalance(
      currMonthCreditCardsTransactions,
    );

    const accountsExpense = this.sumAccountsBalance(
      this.getAccountsBalance(
        accountsTransactions,
        (transaction: TransactionModel) => transaction.isExpense(),
      ),
    );

    const accountsIncome = this.sumAccountsBalance(
      this.getAccountsBalance(
        accountsTransactions,
        (transaction: TransactionModel) => transaction.isIncome(),
      ),
    );

    const billableCreditCardsExpense = this.sumAccountsBalance(
      this.getAccountsBalance(
        billableCreditCardsTransactions,
        (transaction: TransactionModel) => transaction.isExpense(),
      ),
    );

    const creditCardsExpense = this.sumAccountsBalance(
      this.getAccountsBalance(
        currMonthCreditCardsTransactions,
        (transaction: TransactionModel) => transaction.isExpense(),
      ),
    );

    const totalExpense = accountsExpense + creditCardsExpense;
    const totalIncome = accountsIncome;

    const totalBillableExpense = accountsExpense + billableCreditCardsExpense;
    const totalBillableIncome = accountsIncome;

    let balance = totalIncome + totalExpense;
    let billableBalance = totalBillableIncome + totalBillableExpense;

    if (prevMonthBalanceBi) {
      balance = prevMonthBalanceBi.balance + balance;
      billableBalance = prevMonthBalanceBi.billableBalance + billableBalance;
    }

    return {
      accountsBalance,
      accountsExpense,
      accountsIncome,
      balance,
      billableBalance,
      billableCreditCardsBalance,
      billableCreditCardsExpense,
      creditCardsBalance,
      creditCardsExpense,
      prevMonthBalanceBi,
      totalBillableExpense,
      totalBillableIncome,
      totalExpense,
      totalIncome,
    } as BalanceBiDto;
  }

  static async getMonthBalance(date: Date, userId: number): Promise<number> {
    const startMonthDate = new Date(date.getFullYear(), date.getMonth());
    const endMonthDate = lastDayOfMonth(startMonthDate);

    const transactions: TransactionModel[] =
      await TransactionService.getTransactions(userId, {
        endDate: endMonthDate,
        startDate: startMonthDate,
      });

    return transactions.reduce(
      (balance: number, transaction: TransactionModel) =>
        balance + transaction.amount,
      0,
    );
  }

  static sumAccountsBalance(accounts: AccountBalance[]): number {
    return accounts.reduce(
      (sum: number, account: AccountBalance) => sum + account.balance,
      0,
    );
  }
}
