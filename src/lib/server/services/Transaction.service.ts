import { prisma } from '@/lib/server/database';
import {
  ApiPagination,
  ApiPaginationSortOrder,
} from '@/lib/shared/dtos/ApiPaginationParams.dto';
import { TransactionsFilters } from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { Prisma, $Enums as PrismaEnum } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export interface TransactionQueryRawFilters {
  accountId?: number;
  billableEndDate?: Date;
  billableStartDate?: Date;
  endDate?: Date;
  id?: number;
  or?: TransactionQueryRawFilters[];
  paymentMethod?: PrismaEnum.PaymentMethodEnum[];
  placeholderOnly?: boolean;
  repeatOnly?: boolean;
  startDate?: Date;
  type?: PrismaEnum.TransactionTypeEnum[];
}

export class TransactionService {
  static async getTransactions(
    userId: number,
    rawFilters?: TransactionsFilters,
    pagination?: ApiPagination,
  ): Promise<TransactionModel[]> {
    const [transactions] = await this.getTransactionsAndCount(
      userId,
      rawFilters,
      pagination,
    );

    return transactions;
  }

  static async getTransactionsAndCount(
    userId: number,
    rawFilters?: TransactionsFilters,
    pagination?: ApiPagination,
  ): Promise<[TransactionModel[], number]> {
    const filters = this.resolveFilters(userId, rawFilters);
    const orderBy = pagination?.sort?.map((sort: ApiPaginationSortOrder) => ({
      [sort.field]: sort.order,
    }));
    const [transactions, count] = await prisma.transaction.findManyAndCount({
      include: {
        account: true,
        category: true,
        transferTransaction: true,
      },
      orderBy,
      skip: pagination?.skip,
      take: pagination?.take,
      where: filters,
    });

    return [plainToInstance(TransactionModel, transactions), count];
  }

  static resolveFilters(
    userId: number,
    rawFilters?: TransactionQueryRawFilters,
  ): Prisma.TransactionWhereInput {
    const filters: Prisma.TransactionWhereInput = {
      accountId: rawFilters?.accountId,
      category: rawFilters?.placeholderOnly
        ? { name: 'Placeholder' }
        : undefined,
      OR: rawFilters?.or?.map((or: TransactionQueryRawFilters) =>
        this.resolveFilters(userId, or),
      ),
      paymentMethod: rawFilters?.paymentMethod
        ? { in: rawFilters.paymentMethod }
        : undefined,
      repeatId: rawFilters?.repeatOnly ? { not: null } : undefined,
      type: rawFilters?.type ? { in: rawFilters.type } : undefined,
      userId,
    };

    if (rawFilters?.placeholderOnly) filters.category = { name: 'Placeholder' };

    if (rawFilters?.startDate && rawFilters?.endDate)
      filters.date = {
        gte: new Date(rawFilters.startDate).toISOString(),
        lte: new Date(rawFilters.endDate).toISOString(),
      };

    if (rawFilters?.billableStartDate && rawFilters?.billableEndDate)
      filters.billingDate = {
        gte: new Date(rawFilters.billableStartDate).toISOString(),
        lte: new Date(rawFilters.billableEndDate).toISOString(),
      };

    return filters;
  }
}
