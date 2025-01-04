import Body from '@/lib/api/decorators/Body.decorator';
import { Endpoint } from '@/lib/api/decorators/Endpoint.decorator';
import { UserService } from '@/lib/api/services/User.service';
import { AuthSignInBodyDto } from '@/lib/shared/dtos/AuthSignInBody.dto';
import { TokenPayload } from '@/lib/shared/types/Auth.types';

export class AuthController {
  @Endpoint()
  static async signIn(
    @Body({ schema: AuthSignInBodyDto }) body: AuthSignInBodyDto,
  ): Promise<TokenPayload> {
    return await UserService.login(body);
  }
}
