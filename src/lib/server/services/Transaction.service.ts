import { prisma } from '@/lib/server/database';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { addMonths } from '@/lib/shared/utils/Date.utils';
import { $Enums as PrismaEnum } from '@prisma/client';
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
        ignore: { not: true },
        OR: [
          {
            date: {
              gte: new Date(year, month).toISOString(),
              lt: new Date(year, month + 1).toISOString(),
            },
            paymentMethod: PrismaEnum.PaymentMethodEnum.ACCOUNT,
          },
          {
            billingDate: {
              gte: new Date(year, month + 1).toISOString(),
              lt: new Date(year, month + 2).toISOString(),
            },
            paymentMethod: PrismaEnum.PaymentMethodEnum.CREDIT_CARD,
          },
        ],
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
        ignore: { not: true },
        OR: [
          {
            date: {
              lt: date.toISOString(),
            },
            paymentMethod: PrismaEnum.PaymentMethodEnum.ACCOUNT,
          },
          {
            billingDate: {
              lt: addMonths(date, 1).toISOString(),
            },
            paymentMethod: PrismaEnum.PaymentMethodEnum.CREDIT_CARD,
          },
        ],
        userId,
      },
    });

    return plainToInstance(TransactionModel, records);
  }
}
