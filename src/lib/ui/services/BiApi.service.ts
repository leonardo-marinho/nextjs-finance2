import { BalanceBiDto, BiGetBalanceBiParamsDto } from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { ApiResponse } from '@/lib/shared/types/Api.types';
import { ApiService } from '@/lib/ui/services/Api.service';

class BiApiService extends ApiService {
  async getBalanceBi(params: BiGetBalanceBiParamsDto): Promise<ApiResponse<BalanceBiDto>> {
    const response = await this.request<BalanceBiDto, BiGetBalanceBiParamsDto>(`/api/bi/balance`, {
      method: 'GET',
      params,
    });

    return response;
  }
}

export default new BiApiService();
