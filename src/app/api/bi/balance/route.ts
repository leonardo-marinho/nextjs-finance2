import { BiController } from '@/lib/server/controllers/Bi.controller';
import { ApiService } from '@/lib/server/services/Api.service';

export const GET = ApiService.createHandler(BiController.getBalanceBi);
