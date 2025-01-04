import { Endpoint } from '@/lib/api/decorators/Endpoint.decorator';
import { BiService } from '@/lib/api/services/Bi.service';
import {
  BalanceBiDto,
  BiGetBalanceBiParamsDto,
} from '@/lib/shared/dtos/BiGetBalanceBi.dto';
import { DateUtils } from '@/lib/shared/utils/Date.utils';

import { Params } from '../decorators/Args';

export class BiController {
  @Endpoint({ private: true })
  static async getBalanceBi(
    @Params({ schema: BiGetBalanceBiParamsDto })
    { date }: BiGetBalanceBiParamsDto,
  ): Promise<BalanceBiDto> {
    const startMonthDate = new Date(date.getFullYear(), date.getMonth());
    const endMonthDate = DateUtils.addMonths(startMonthDate, 1);

    return BiService.getBalanceBi(startMonthDate, endMonthDate);
  }
}
