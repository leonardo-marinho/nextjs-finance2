import { prisma } from '@/lib/server/database';
import { AuthService } from '@/lib/server/services/Auth.service';
import { TokenPayload } from '@/lib/server/types/Auth.types';
import { AuthSignInBodyDto } from '@/lib/shared/dtos/AuthSignInBody.dto';
import { AuthSignUpBody } from '@/lib/shared/dtos/AuthSignUpBody.dto';
import { ApiAuthException } from '@/lib/shared/exceptions/ApiAuth.exception';
import { UserModel } from '@/lib/shared/models/User.model';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { omit } from 'lodash';

export class UserService {
  static async getByEmail(email: string): Promise<null | User> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async login(body: AuthSignInBodyDto): Promise<TokenPayload> {
    const user = await this.getByEmail(body.email);

    if (!user)
      throw new ApiAuthException('User with this email does not exist');

    if (!bcrypt.compareSync(body.password, user.password))
      throw new ApiAuthException('Invalid password');

    const userWithoutPassword = omit(user, 'password');
    const token = AuthService.signIn(userWithoutPassword);
    const refreshToken = AuthService.generateRefreshToken(userWithoutPassword);

    return {
      refreshToken,
      token,
    };
  }

  static async register(body: AuthSignUpBody): Promise<UserModel> {
    if (await this.getByEmail(body.email))
      throw new ApiAuthException('User with this email already exists');

    const hashedPassword = bcrypt.hashSync(body.password, 8);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    return plainToClass(UserModel, user);
  }
}
