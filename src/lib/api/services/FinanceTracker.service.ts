import { prisma } from '@/lib/api/database';
import { FinanceTrackerUpdateTransactionBody } from '@/lib/shared/dtos/FinanceTrackerUpdateTransactionBody.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { addMonths, addWeeks } from '@/lib/shared/utils/Date.utils';
import { Prisma, $Enums as PrismaEnums } from '@prisma/client';

export class FinanceTrackerService {
  static async createRepeatTransaction(
    data: Prisma.TransactionUncheckedCreateInput,
    body: FinanceTrackerUpdateTransactionBody,
  ): Promise<void> {
    const repeatInstallments = body.repeatInstallments || 2;

    const transactionRepeatRecord = await prisma.transactionRepeat.create({
      data: { type: body.repeatType, userId: data.userId },
    });

    const repeatData: Prisma.TransactionUncheckedCreateInput[] = Array.from(
      { length: repeatInstallments },
      (_: never, i: number) =>
        ({
          ...data,
          [body.paymentMethod === PrismaEnums.PaymentMethodEnum.CREDIT_CARD
            ? 'billingDate'
            : 'date']:
            body.repeatType === PrismaEnums.TransactionRepeatEnum.MONTHLY
              ? addMonths(body.date, i)
              : addWeeks(body.date, i),
          repeatId: transactionRepeatRecord.id,
        }) as Prisma.TransactionUncheckedCreateInput,
    );

    await prisma.transaction.createMany({
      data: repeatData,
    });
  }

  static async deleteRepeatTransaction(repeatId: number): Promise<void> {
    await prisma.transaction.deleteMany({
      where: {
        repeatId,
      },
    });

    await prisma.transactionRepeat.delete({
      where: {
        id: repeatId,
      },
    });
  }

  static resolveTags(
    transactions: TransactionModel[],
  ): Record<string, string[]> {
    const tags = new Map<string, string[]>();
    transactions.forEach((transaction: TransactionModel) => {
      if (!transaction.Category || !transaction.tags) return;

      const [key, newValue] = [transaction.tags, transaction.Category.name];

      const value = tags.get(key) || [];
      tags.set(key, [...value, newValue]);
    });

    tags.forEach((value: string[], key: string) =>
      tags.set(key, [...new Set(value)]),
    );

    return Object.fromEntries(tags);
  }

  static trimTags(tags?: null | string): null | string {
    return !tags?.trim().length ? null : tags.trim();
  }

  static async updateRepeatTransaction(
    repeatId: number,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<void> {
    await prisma.transaction.updateMany({
      data,
      where: {
        repeatId,
      },
    });
  }
}
