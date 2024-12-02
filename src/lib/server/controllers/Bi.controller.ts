import { Endpoint } from '@/lib/server/decorators/Endpoint.decorator';
import Params from '@/lib/server/decorators/Params.decorator';
import UserId from '@/lib/server/decorators/UserId.decorator';
import { BiService } from '@/lib/server/services/Bi.service';
import {
  BalanceBiDto,
  BiGetBalanceBiParamsDto,
} from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { lastDayOfMonth } from '@/lib/shared/utils/Date.utils';

export class BiController {
  @Endpoint({ private: true })
  static async getBalanceBi(
    @UserId() userId: number,
    @Params({ schema: BiGetBalanceBiParamsDto })
    { date }: BiGetBalanceBiParamsDto,
  ): Promise<BalanceBiDto> {
    const startMonthDate = new Date(date.getFullYear(), date.getMonth());
    const endMonthDate = lastDayOfMonth(startMonthDate);

    return BiService.getBalanceBi(userId, startMonthDate, endMonthDate);
  }
}
