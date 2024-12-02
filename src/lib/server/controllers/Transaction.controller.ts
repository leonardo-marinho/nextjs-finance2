import { Endpoint } from '@/lib/server/decorators/Endpoint.decorator';
import Params from '@/lib/server/decorators/Params.decorator';
import Query from '@/lib/server/decorators/Query.decorator';
import UserId from '@/lib/server/decorators/UserId.decorator';
import { TransactionService } from '@/lib/server/services/Transaction.service';
import { createPaginatedData } from '@/lib/server/utils/Api.utils';
import { GetTransactionsParamsDto } from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { ApiNotFoundException } from '@/lib/shared/exceptions/ApiNotFound.exception';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { ApiPaginatedData } from '@/lib/shared/types/Api.types';
import { plainToInstance } from 'class-transformer';

export class TransactionController {
  @Endpoint({ private: true })
  static async getTransactionById(
    @UserId() userId: number,
    @Query({ schema: IdQueryDto }) { id }: IdQueryDto,
  ): Promise<null | TransactionModel> {
    const transactions = await TransactionService.getTransactions(userId, {
      id,
    });
    const transaction = transactions?.[0];

    if (!transaction)
      throw new ApiNotFoundException(`Transaction with id ${id} not found`);

    return plainToInstance(TransactionModel, transaction);
  }

  @Endpoint({ private: true })
  static async getTransactions(
    @UserId() userId: number,
    @Params({ schema: GetTransactionsParamsDto })
    params: GetTransactionsParamsDto,
  ): Promise<ApiPaginatedData<TransactionModel>> {
    const [transactions, count] =
      await TransactionService.getTransactionsAndCount(
        userId,
        params?.filters,
        params?.pagination,
      );

    return createPaginatedData<TransactionModel>(
      plainToInstance(TransactionModel, transactions),
      count,
      params?.pagination?.skip,
      params?.pagination?.take,
    );
  }
}
