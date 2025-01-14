import { prisma } from '@/lib/api/database';
import { Endpoint } from '@/lib/api/decorators/Endpoint.decorator';
import { FinanceTrackerService } from '@/lib/api/services/FinanceTracker.service';
import { FinanceTrackerOptionsDto } from '@/lib/shared/dtos/FinanceTrackerOptions.dto';
import { FinanceTrackerUpdateTransactionBody } from '@/lib/shared/dtos/FinanceTrackerUpdateTransactionBody.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { Prisma } from '@prisma/client';
import {
  $Enums as PrismaEnums,
  TransactionCategory as TransactionCategoryPrismaModel,
} from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';

import { Body, Query, UserId } from '../decorators/Args';

export class FinanceTrackerController {
  @Endpoint({ private: true })
  static async createTransaction(
    @UserId() userId: number,
    @Body({ schema: FinanceTrackerUpdateTransactionBody })
    body: FinanceTrackerUpdateTransactionBody,
  ): Promise<boolean> {
    const amount = Math.abs(body.amount);
    const data: Prisma.TransactionUncheckedCreateInput = {
      accountId: body.accountId,
      amount:
        body.type === PrismaEnums.TransactionTypeEnum.EXPENSE
          ? -amount
          : amount,
      categoryId: body.categoryId,
      date: body.date.toISOString(),
      ignore: body.ignore,
      notes: body.notes,
      paymentMethod: body.paymentMethod,
      status: body.status,
      tags: FinanceTrackerService.trimTags(body.tags),
      type: body.type,
      userId,
    };

    if (body.paymentMethod === PrismaEnums.PaymentMethodEnum.CREDIT_CARD) {
      if (!body.billingDate)
        throw new Error(
          'Billing date is required for credit card transactions',
        );
      else data.billingDate = body.billingDate;

      if (body.billingDate < body.date)
        throw new Error('Billing date cannot be before transaction date');
    }

    if (body.repeatType !== PrismaEnums.TransactionRepeatEnum.NONE)
      FinanceTrackerService.createRepeatTransaction(data, body);
    else await prisma.transaction.create({ data });

    return true;
  }

  @Endpoint({ private: true })
  static async deleteTransaction(
    @Query({ schema: IdQueryDto }) { id }: IdQueryDto,
  ): Promise<boolean> {
    const originalTransaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    });

    if (!originalTransaction) throw new Error('Transaction not found');

    if (!!originalTransaction.repeatId)
      await FinanceTrackerService.deleteRepeatTransaction(
        originalTransaction.repeatId,
      );
    else await prisma.transaction.delete({ where: { id } });

    return true;
  }

  @Endpoint({ private: true })
  static async getOptions(): Promise<FinanceTrackerOptionsDto> {
    const [accounts, categories, transactionsRaw] = await prisma.$transaction([
      prisma.account.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.transactionCategory.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.transaction.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 250,
      }),
    ]);

    const transactions: TransactionModel[] = plainToInstance(
      TransactionModel,
      transactionsRaw,
    );

    return {
      accounts,
      expenseCategories: categories.filter(
        (category: TransactionCategoryPrismaModel) =>
          category.type === PrismaEnums.TransactionTypeEnum.EXPENSE ||
          category.type === PrismaEnums.TransactionTypeEnum.TRANSFER,
      ),
      incomeCategories: categories.filter(
        (category: TransactionCategoryPrismaModel) =>
          category.type === PrismaEnums.TransactionTypeEnum.INCOME ||
          category.type === PrismaEnums.TransactionTypeEnum.TRANSFER,
      ),
      tags: FinanceTrackerService.resolveTags(transactions),
      transactionCategories: categories.filter(
        (category: TransactionCategoryPrismaModel) =>
          category.type === PrismaEnums.TransactionTypeEnum.TRANSFER,
      ),
    };
  }

  @Endpoint({ private: true })
  static async updateTransaction(
    @Query({ schema: IdQueryDto }) { id }: IdQueryDto,
    @Body({ schema: FinanceTrackerUpdateTransactionBody })
    body: FinanceTrackerUpdateTransactionBody,
  ): Promise<boolean> {
    const amount = Math.abs(body.amount);
    const data: Prisma.TransactionUncheckedUpdateInput = {
      accountId: body.accountId,
      amount:
        body.type === PrismaEnums.TransactionTypeEnum.EXPENSE
          ? -amount
          : amount,
      categoryId: body.categoryId,
      date: body.date.toISOString(),
      ignore: body.ignore,
      notes: body.notes,
      paymentMethod: body.paymentMethod,
      status: body.status,
      tags: FinanceTrackerService.trimTags(body.tags),
      type: body.type,
    };

    if (body.paymentMethod === PrismaEnums.PaymentMethodEnum.CREDIT_CARD) {
      if (!body.billingDate)
        throw new Error(
          'Billing date is required for credit card transactions',
        );
      else data.billingDate = body.billingDate;

      if (body.billingDate < body.date)
        throw new Error('Billing date cannot be before transaction date');
    }

    const originalTransaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    });

    if (!originalTransaction) throw new Error('Transaction not found');

    if (
      body.repeatType !== PrismaEnums.TransactionRepeatEnum.NONE &&
      !!originalTransaction.repeatId
    )
      FinanceTrackerService.updateRepeatTransaction(
        originalTransaction.repeatId,
        omit(data, 'date'),
      );
    else await prisma.transaction.update({ data, where: { id } });

    return true;
  }
}
