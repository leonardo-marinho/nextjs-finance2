import { prisma } from '@/lib/api/database';
import { AuthService } from '@/lib/api/services/Auth.service';
import { AuthSignInBodyDto } from '@/lib/shared/dtos/AuthSignInBody.dto';
import { AuthSignUpBody } from '@/lib/shared/dtos/AuthSignUpBody.dto';
import { ApiAuthException } from '@/lib/shared/exceptions/ApiAuth.exception';
import { UserModel } from '@/lib/shared/models/User.model';
import { TokenPayload } from '@/lib/shared/types/Auth.types';
import { $Enums as PrismaEnum, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { pick } from 'lodash';

export class UserService {
  static async getByEmail(email: string): Promise<null | User> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  static async getUserRoles(userId: number): Promise<PrismaEnum.Role[]> {
    const user = await prisma.user.findUnique({
      select: { roles: true },
      where: { id: userId },
    });

    return user?.roles || [];
  }

  static async login(body: AuthSignInBodyDto): Promise<TokenPayload> {
    const user = await this.getByEmail(body.email);

    if (!user)
      throw new ApiAuthException('User with this email does not exist');

    if (!bcrypt.compareSync(body.password, user.password))
      throw new ApiAuthException('Invalid password');

    const userTokenPayload = pick(user, ['id', 'email']);
    const token = AuthService.signIn(userTokenPayload);
    const refreshToken = AuthService.generateRefreshToken(userTokenPayload);

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
