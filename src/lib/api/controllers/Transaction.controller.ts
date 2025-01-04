import { Endpoint } from '@/lib/api/decorators/Endpoint.decorator';
import { TransactionService } from '@/lib/api/services/Transaction.service';
import { GetTransactionsParamsDto } from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { ApiNotFoundException } from '@/lib/shared/exceptions/ApiNotFound.exception';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { ApiPaginatedData } from '@/lib/shared/types/Api.types';
import { ApiResponseUtils } from '@/lib/shared/utils/ApiResponse.utils';
import { plainToInstance } from 'class-transformer';

import { Params, Query } from '../decorators/Args';

export class TransactionController {
  @Endpoint({ private: true })
  static async getTransactionById(
    @Query({ schema: IdQueryDto }) { id }: IdQueryDto,
  ): Promise<null | TransactionModel> {
    const transactions = await TransactionService.getTransactions({
      id,
    });
    const transaction = transactions?.[0];

    if (!transaction)
      throw new ApiNotFoundException(`Transaction with id ${id} not found`);

    return plainToInstance(TransactionModel, transaction);
  }

  @Endpoint({ private: true })
  static async getTransactions(
    @Params({ schema: GetTransactionsParamsDto })
    params: GetTransactionsParamsDto,
  ): Promise<ApiPaginatedData<TransactionModel>> {
    const [transactions, count] =
      await TransactionService.getTransactionsAndCount(
        params?.filters,
        params?.pagination,
      );

    return ApiResponseUtils.createPaginatedData<TransactionModel>(
      plainToInstance(TransactionModel, transactions),
      count,
      params?.pagination?.skip,
      params?.pagination?.take,
    );
  }
}
