import {
  GetTransactionsParamsDto,
  TransactionsFilters,
} from '@/lib/shared/dtos/GetTransactionsParams.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { ApiPaginatedData, ApiResponse } from '@/lib/shared/types/Api.types';
import { paginatedResponseToInstance } from '@/lib/shared/utils/PaginatedResponseToInstance';
import { ApiService } from '@/lib/ui/services/Api.service';

class TransactionApiService extends ApiService {
  async getTransactionById(
    args: IdQueryDto,
  ): Promise<ApiResponse<TransactionModel>> {
    return this.request<TransactionModel>(`/api/transactions/${args.id}`, {
      method: 'GET',
    });
  }

  async getTransactions(
    params?: GetTransactionsParamsDto,
  ): Promise<ApiResponse<ApiPaginatedData<TransactionModel>>> {
    const response = await this.request<
      ApiPaginatedData<TransactionModel>,
      GetTransactionsParamsDto
    >(`/api/transactions`, {
      method: 'GET',
      params: {
        ...params,
        filters: JSON.stringify(params?.filters) as TransactionsFilters,
        pagination: JSON.stringify(
          params?.pagination,
        ) as GetTransactionsParamsDto['pagination'],
      },
    });

    return paginatedResponseToInstance(response, TransactionModel);
  }
}

export default new TransactionApiService();
