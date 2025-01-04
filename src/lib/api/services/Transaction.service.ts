import { prisma } from '@/lib/api/database';
import {
  ApiPagination,
  ApiPaginationSortOrder,
} from '@/lib/shared/dtos/ApiPaginationParams.dto';
import { TransactionsFilters } from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { TransactionQueryRawFilters } from '@/lib/shared/types/Transaction.types';
import { Prisma, $Enums as PrismaEnum } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export class TransactionService {
  static async getTransactions(
    rawFilters?: TransactionsFilters,
    pagination?: ApiPagination,
  ): Promise<TransactionModel[]> {
    const [transactions] = await this.getTransactionsAndCount(
      rawFilters,
      pagination,
    );

    return transactions;
  }

  static async getTransactionsAndCount(
    rawFilters?: TransactionsFilters,
    pagination?: ApiPagination,
  ): Promise<[TransactionModel[], number]> {
    const filters = this.resolveFilters(rawFilters);
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
    rawFilters?: TransactionQueryRawFilters,
  ): Prisma.TransactionWhereInput {
    const filters: Prisma.TransactionWhereInput = {
      accountId: rawFilters?.accountId,
      category: rawFilters?.placeholderOnly
        ? { name: 'Placeholder' }
        : undefined,
      OR: rawFilters?.or?.map((or: TransactionQueryRawFilters) =>
        this.resolveFilters(or),
      ),
      paymentMethod: rawFilters?.paymentMethod
        ? { in: rawFilters.paymentMethod }
        : undefined,
      repeatId: rawFilters?.repeatOnly ? { not: null } : undefined,
      type: rawFilters?.type ? { in: rawFilters.type } : undefined,
    };

    if (rawFilters?.placeholderOnly) filters.category = { name: 'Placeholder' };

    if (rawFilters?.pendingOnly)
      filters.status = PrismaEnum.TransactionStatusEnum.PENDING;

    if (rawFilters?.startDate && rawFilters?.endDate)
      filters.date = {
        gte: (rawFilters.startDate?.toISOString?.()
          ? rawFilters.startDate
          : new Date(rawFilters.startDate)
        )?.toISOString(),
        lt: (rawFilters.endDate?.toISOString?.()
          ? rawFilters.endDate
          : new Date(rawFilters.endDate)
        )?.toISOString(),
      };

    if (rawFilters?.billableStartDate && rawFilters?.billableEndDate)
      filters.billingDate = {
        gte: (rawFilters.billableStartDate?.toISOString?.()
          ? rawFilters.billableStartDate
          : new Date(rawFilters.billableStartDate)
        )?.toISOString(),
        lt: (rawFilters.billableEndDate?.toISOString?.()
          ? rawFilters.billableEndDate
          : new Date(rawFilters.billableEndDate)
        )?.toISOString(),
      };

    return filters;
  }
}
