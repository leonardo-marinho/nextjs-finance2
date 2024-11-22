import Body from '@/lib/server/decorators/Body.decorator';
import { Endpoint } from '@/lib/server/decorators/Endpoint.decorator';
import { UserService } from '@/lib/server/services/User.service';
import { TokenPayload } from '@/lib/server/types/Auth.types';
import { AuthSignInBodyDto } from '@/lib/shared/dtos/AuthSignInBody.dto';

export class AuthController {
  @Endpoint({ private: true })
  static async signIn(
    @Body({ schema: AuthSignInBodyDto }) body: AuthSignInBodyDto,
  ): Promise<TokenPayload> {
    return await UserService.login(body);
  }
}
