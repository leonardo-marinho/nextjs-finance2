import { BiController } from '@/lib/api/controllers/Bi.controller';
import { ApiService } from '@/lib/api/services/Api.service';

export const GET = ApiService.createHandler(BiController.getBalanceBi);
