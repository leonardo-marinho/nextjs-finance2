import { prisma } from '@/lib/server/database';
import Body from '@/lib/server/decorators/Body.decorator';
import { Endpoint } from '@/lib/server/decorators/Endpoint.decorator';
import Query from '@/lib/server/decorators/Query.decorator';
import UserId from '@/lib/server/decorators/UserId.decorator';
import { FinanceTrackerService } from '@/lib/server/services/FinanceTracker.service';
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
      tags: FinanceTrackerService.trimTags(body.tags),
      type: body.type,
      userId,
    };

    if (body.repeatType !== PrismaEnums.TransactionRepeatEnum.NONE)
      FinanceTrackerService.createRepeatTransaction(data, body);
    else await prisma.transaction.create({ data });

    return true;
  }

  @Endpoint({ private: true })
  static async deleteTransaction(
    @UserId() userId: number,
    @Query({ schema: IdQueryDto }) { id }: IdQueryDto,
  ): Promise<boolean> {
    const originalTransaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId,
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
  static async getOptions(
    @UserId() userId: number,
  ): Promise<FinanceTrackerOptionsDto> {
    const [accounts, categories, transactionsRaw] = await prisma.$transaction([
      prisma.account.findMany({
        orderBy: {
          name: 'asc',
        },
        where: {
          userId,
        },
      }),
      prisma.transactionCategory.findMany({
        orderBy: {
          name: 'asc',
        },
        where: {
          userId,
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
        where: {
          userId,
        },
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
    @UserId() userId: number,
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
      tags: FinanceTrackerService.trimTags(body.tags),
      type: body.type,
    };

    const originalTransaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId,
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
