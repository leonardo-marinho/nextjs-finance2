import { FinanceTrackerOptionsDto } from '@/lib/shared/dtos/FinanceTrackerOptions.dto';
import { FinanceTrackerUpdateTransactionBody } from '@/lib/shared/dtos/FinanceTrackerUpdateTransactionBody.dto';
import { IdQueryDto } from '@/lib/shared/dtos/IdQuery.dto';
import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { ApiResponse } from '@/lib/shared/types/Api.types';
import { ApiService } from '@/lib/ui/services/Api.service';

class FinanceTrackerApiService extends ApiService {
  async createTransaction(
    args: FinanceTrackerUpdateTransactionBody,
  ): Promise<ApiResponse<TransactionModel>> {
    return this.request<TransactionModel, FinanceTrackerUpdateTransactionBody>(
      `/api/finance-tracker`,
      {
        body: args,
        method: 'POST',
      },
    );
  }

  async deleteTransaction(params: IdQueryDto): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/api/finance-tracker/${params.id}`, {
      method: 'DELETE',
    });
  }

  async getOptions(): Promise<ApiResponse<FinanceTrackerOptionsDto>> {
    return this.request<FinanceTrackerOptionsDto>(
      `/api/finance-tracker/options`,
      {
        method: 'GET',
      },
    );
  }

  async updateTransaction(
    params: IdQueryDto,
    args: FinanceTrackerUpdateTransactionBody,
  ): Promise<ApiResponse<TransactionModel>> {
    return this.request<TransactionModel, FinanceTrackerUpdateTransactionBody>(
      `/api/finance-tracker/${params.id}`,
      {
        body: args,
        method: 'PUT',
      },
    );
  }
}

export default new FinanceTrackerApiService();
