import { prisma } from '@/lib/server/database';
import { Endpoint } from '@/lib/server/decorators/Endpoint.decorator';
import Params from '@/lib/server/decorators/Params.decorator';
import Query from '@/lib/server/decorators/Query.decorator';
import UserId from '@/lib/server/decorators/UserId.decorator';
import { createPaginatedData } from '@/lib/server/utils/Api.utils';
import { GetTransactionsParamsDto } from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { ApiNotFoundException } from '@/lib/shared/exceptions/ApiNotFound.exception';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { ApiPaginatedData } from '@/lib/shared/types/Api.types';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export class TransactionController {
  @Endpoint({ private: true })
  static async getTransactionById(
    @UserId() userId: number,
    @Query({ schema: IdQueryDto }) { id }: IdQueryDto,
  ): Promise<null | TransactionModel> {
    const record = await prisma.transaction.findUnique({
      include: {
        account: true,
        category: true,
      },
      where: {
        id,
        userId,
      },
    });

    if (!record)
      throw new ApiNotFoundException(`Transaction with id ${id} not found`);

    return plainToInstance(TransactionModel, record);
  }

  @Endpoint({ private: true })
  static async getTransactions(
    @UserId() userId: number,
    @Params({ schema: GetTransactionsParamsDto })
    params: GetTransactionsParamsDto,
  ): Promise<ApiPaginatedData<TransactionModel>> {
    const filters: Prisma.TransactionWhereInput = {
      accountId: params?.accountId,
      paymentMethod: { in: params.paymentMethod },
      repeatId: params.repeatOnly ? { not: null } : undefined,
      type: params.type,
      userId,
    };

    if (params?.startDate && params?.endDate)
      filters.date = {
        gte: params.startDate.toISOString(),
        lte: params.endDate.toISOString(),
      };

    const [transactions, count] = await prisma.transaction.findManyAndCount({
      include: {
        account: true,
        category: true,
      },
      orderBy: [{ date: params.sortOrder }, { createdAt: params.sortOrder }],
      skip: params.skip,
      take: params.take,
      where: filters,
    });

    return createPaginatedData<TransactionModel>(
      plainToInstance(TransactionModel, transactions),
      count,
      params.skip,
      params.take,
    );
  }
}
