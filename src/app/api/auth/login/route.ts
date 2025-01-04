import { AuthController } from '@/lib/api/controllers/Auth.controller';
import { ApiService } from '@/lib/api/services/Api.service';

export const POST = ApiService.createHandler(AuthController.signIn);
