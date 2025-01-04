import { Endpoint } from '@/lib/api/decorators/Endpoint.decorator';
import Params from '@/lib/api/decorators/Params.decorator';
import UserId from '@/lib/api/decorators/UserId.decorator';
import { BiService } from '@/lib/api/services/Bi.service';
import {
  BalanceBiDto,
  BiGetBalanceBiParamsDto,
} from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { addMonths } from '@/lib/shared/utils/Date.utils';

export class BiController {
  @Endpoint({ private: true })
  static async getBalanceBi(
    @UserId() userId: number,
    @Params({ schema: BiGetBalanceBiParamsDto })
    { date }: BiGetBalanceBiParamsDto,
  ): Promise<BalanceBiDto> {
    const startMonthDate = new Date(date.getFullYear(), date.getMonth());
    const endMonthDate = addMonths(startMonthDate, 1);

    return BiService.getBalanceBi(userId, startMonthDate, endMonthDate);
  }
}
