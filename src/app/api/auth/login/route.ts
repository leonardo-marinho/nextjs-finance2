import { AuthController } from '@/lib/server/controllers/Auth.controller';
import { ApiService } from '@/lib/server/services/Api.service';

export const POST = ApiService.createHandler(AuthController.signIn);
