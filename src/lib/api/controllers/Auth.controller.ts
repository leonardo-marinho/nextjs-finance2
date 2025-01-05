import { Endpoint } from '@/lib/api/decorators/Endpoint.decorator';
import { UserService } from '@/lib/api/services/User.service';
import { AuthSignInBodyDto } from '@/lib/shared/dtos/AuthSignInBody.dto';
import { TokenPayload } from '@/lib/shared/types/Auth.types';

import { Body } from '../decorators/Args';

export class AuthController {
  @Endpoint({
    private: false,
  })
  static async signIn(
    @Body({ schema: AuthSignInBodyDto }) body: AuthSignInBodyDto,
  ): Promise<TokenPayload> {
    return await UserService.login(body);
  }
}
