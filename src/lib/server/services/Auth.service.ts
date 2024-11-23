import { config } from '@/lib/shared/config';
import { ApiAuthException } from '@/lib/shared/exceptions/ApiAuth.exception';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { omit } from 'lodash';

export class AuthService {
  static createPayload(user: Partial<User>): Record<string, unknown> {
    return { ...omit(user, 'id'), sub: user.id };
  }

  static extractUserId(token?: string): number {
    if (!token) throw new ApiAuthException('No token provided');

    const payload = jwt.verify(token, AuthService.Secret);

    return Number(payload.sub as string);
  }

  static generateRefreshToken(user: Partial<User>): string {
    const payload = AuthService.createPayload(user);
    const options = { expiresIn: config.jwt.expiresIn };

    return jwt.sign(payload, AuthService.Secret, options);
  }

  static get Secret(): string {
    return config.jwt.secret;
  }

  static signIn(user: Partial<User>): string {
    const payload = AuthService.createPayload(user);

    return jwt.sign(payload, AuthService.Secret);
  }

  static verifyRefreshToken(token?: string): boolean {
    if (!token) throw new Error('No token provided');

    jwt.verify(token, AuthService.Secret);

    return true;
  }
}
