import { Endpoint } from '@/lib/server/decorators/Endpoint.decorator';
import Params from '@/lib/server/decorators/Params.decorator';
import UserId from '@/lib/server/decorators/UserId.decorator';
import { BiService } from '@/lib/server/services/Bi.service';
import { BalanceBiDto, BiGetBalanceBiParamsDto } from '@/lib/shared/dtos/BiGetBalanceBi.dto';

export class BiController {
  @Endpoint({ private: true })
  static async getBalanceBi(@UserId() userId: number, @Params({schema: BiGetBalanceBiParamsDto}) {date}: BiGetBalanceBiParamsDto): Promise<BalanceBiDto> {
    return BiService.getBalanceBi(date, userId);
  }
}
