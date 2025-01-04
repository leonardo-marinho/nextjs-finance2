import { AuthService } from '@/lib/server/services/Auth.service';
import { parsePayload } from '@/lib/server/utils/Api.utils';
import { config } from '@/lib/shared/config';
import { ApiBodyValidationException } from '@/lib/shared/exceptions/ApiBodyValidation.exception';
import { ApiInternalServerErrorException } from '@/lib/shared/exceptions/ApiInternalServerError.exception';
import { ApiParamsValidationException } from '@/lib/shared/exceptions/ApiParamsValidation.exception';
import { ApiQueryValidationException } from '@/lib/shared/exceptions/ApiQueryValidation.exception';
import { ApiUnauthorizedException } from '@/lib/shared/exceptions/ApiUnauthorized.exception';
import {
  getArgRequestMetadata,
  processArgRequestMetadata,
} from '@/lib/shared/utils/Decorator.utils';
import { isStrictNullOrUndefined } from '@/lib/shared/utils/Value';
import { ClassConstructor } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import 'reflect-metadata';

interface EndpointOptions {
  private?: boolean;
}

interface NextContext {
  params: Record<string, unknown>;
}

export const Endpoint =
  (options?: EndpointOptions) =>
  (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    descriptor.value = async (
      req: NextRequest,
      context: NextContext,
    ): Promise<void> => {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;

      let userId: number | undefined = undefined;

      if (!!options?.private) {
        if (!token)
          throw new ApiUnauthorizedException(
            'Unauthorized. Token not provided',
          );

        try {
          if (!config.node.isDevEnv()) AuthService.verifyRefreshToken(token);

          userId = AuthService.extractUserId(token);
          Object.defineProperty(this, 'isPrivate', {
            value: true,
            writable: true,
          });
        } catch (_) {
          throw new ApiInternalServerErrorException('Failed to verify token');
        }
      }

      const args: unknown[] = [];

      let body: unknown = null;

      if (
        !isStrictNullOrUndefined(
          getArgRequestMetadata<ClassConstructor<unknown>>(
            'body',
            target,
            propertyKey,
          ),
        )
      ) {
        const bodySchema = getArgRequestMetadata<ClassConstructor<unknown>>(
          'bodySchema',
          target,
          propertyKey,
        );
        try {
          body = await req.json();

          if (bodySchema) body = await parsePayload(body || {}, bodySchema);
        } catch (error) {
          throw new ApiBodyValidationException(error as ValidationError[]);
        }
      }

      const paramsSchema = getArgRequestMetadata<ClassConstructor<unknown>>(
        'paramsSchema',
        target,
        propertyKey,
      );
      let params: Record<string, unknown> = {};
      req.nextUrl.searchParams.forEach((value: string, key: string) => {
        try {
          params[key] = JSON.parse(value);
        } catch (_) {
          params[key] = value;
        }
      });

      if (paramsSchema)
        try {
          params = (await parsePayload(params || {}, paramsSchema)) as Record<
            string,
            unknown
          >;
        } catch (error) {
          throw new ApiParamsValidationException(paramsSchema.name, [
            error,
          ] as ValidationError[]);
        }

      const querySchema = getArgRequestMetadata<ClassConstructor<unknown>>(
        'querySchema',
        target,
        propertyKey,
      );
      let query: unknown = context.params;
      try {
        if (querySchema) query = await parsePayload(query || {}, querySchema);
      } catch (error) {
        throw new ApiQueryValidationException(error as ValidationError[]);
      }

      processArgRequestMetadata('userId', userId, args, target, propertyKey);
      processArgRequestMetadata('body', body, args, target, propertyKey);
      processArgRequestMetadata('params', params, args, target, propertyKey);
      processArgRequestMetadata('query', query, args, target, propertyKey);
      processArgRequestMetadata('req', req, args, target, propertyKey);

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
