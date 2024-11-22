import { TokenPayload } from '@/lib/server/types/Auth.types';
import { AuthSignInBodyDto } from '@/lib/shared/dtos/AuthSignInBody.dto';
import { ApiResponse } from '@/lib/shared/types/Api.types';
import { ApiService } from '@/lib/ui/services/Api.service';

class AuthApiService extends ApiService {
  async login(args: AuthSignInBodyDto): Promise<ApiResponse<TokenPayload>> {
    const response = await this.request<TokenPayload, AuthSignInBodyDto>(
      `/api/auth/login`,
      {
        body: args,
        method: 'POST',
      },
    );

    return response;
  }
}

export default new AuthApiService();
