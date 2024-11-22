import { prisma } from '@/lib/server/database';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { plainToInstance } from 'class-transformer';

export class TransactionService {
  static async getTransactionsByMonth(
    date: Date,
    userId: number,
  ): Promise<TransactionModel[]> {
    const month: number = date.getMonth();
    const year: number = date.getFullYear();
    const records = await prisma.transaction.findMany({
      include: {
        account: true,
        category: true,
        transferTransaction: true,
      },
      where: {
        date: {
          gte: new Date(year, month).toISOString(),
          lt: new Date(year, month + 1).toISOString(),
        },
        ignore: {not: true},
        userId,
      },
    });

    return plainToInstance(TransactionModel, records);
  }

  static async getTransactionsUntilDate(
    date: Date,
    userId: number,
  ): Promise<TransactionModel[]> {
    const records = await prisma.transaction.findMany({
      include: {
        account: true,
        category: true,
        transferTransaction: true,
      },
      where: {
        date: {
          lt: date.toISOString(),
        },
        ignore: {not: true},
        userId,
      },
    });

    return plainToInstance(TransactionModel, records);
  }
}
