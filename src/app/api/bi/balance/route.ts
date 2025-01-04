import { BiController } from '@/lib/api/controllers/Bi.controller';
import { ApiUtils } from '@/lib/api/utils/Api.utils';

export const GET = ApiUtils.handleMethod(BiController.getBalanceBi);
