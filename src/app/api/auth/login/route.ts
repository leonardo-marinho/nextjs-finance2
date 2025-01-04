import { AuthController } from '@/lib/api/controllers/Auth.controller';
import { ApiUtils } from '@/lib/api/utils/Api.utils';

export const POST = ApiUtils.handleMethod(AuthController.signIn);
