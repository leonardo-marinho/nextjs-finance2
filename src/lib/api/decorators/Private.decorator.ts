import { AuthService } from '@/lib/api/services/Auth.service';
import { config } from '@/lib/shared/config';
import { ApiInternalServerErrorException } from '@/lib/shared/exceptions/ApiInternalServerError.exception';
import { ApiUnauthorizedException } from '@/lib/shared/exceptions/ApiUnauthorized.exception';
import { NextApiRequest, NextApiResponse } from 'next';

const Private = (
  _target: unknown,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const originalMethod = descriptor.value;

  descriptor.value = async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: unknown,
  ): Promise<void> => {
    if (config.node.isDevEnv()) {
      return await originalMethod.apply(this, [req, res, next]);
    }

    const token = req.headers?.authorization;

    if (!token) throw new ApiUnauthorizedException('Unauthorized');

    try {
      AuthService.verifyRefreshToken(token);
      Object.defineProperty(this, 'isPrivate', { value: true, writable: true });
    } catch (_) {
      throw new ApiInternalServerErrorException('Failed to verify token');
    }

    return await originalMethod.apply(this, [req, res, next]);
  };

  return descriptor;
};

export default Private;
