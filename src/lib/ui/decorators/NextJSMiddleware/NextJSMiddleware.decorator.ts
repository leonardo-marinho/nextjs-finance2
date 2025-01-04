import { processArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';
import { NextRequest } from 'next/server';

export const NextJSMiddleware =
  () =>
  (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    'use server';
    const originalDescriptorValue = descriptor.value;

    descriptor.value = async (request: NextRequest): Promise<void> => {
      const args: unknown[] = [];

      const nextUrl = request.nextUrl;
      processArgRequestMetadata('nextUrl', nextUrl, args, target, propertyKey);

      const token = request.cookies.get('token');
      processArgRequestMetadata('token', token, args, target, propertyKey);

      return await originalDescriptorValue.apply(this, args);
    };

    return descriptor;
  };
