import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';

export const Url = () => {
  return (
    target: object,
    propertyKey: string | symbol,
    argIndex: number,
  ): void => {
    generateArgRequestMetadata('nextUrl', target, propertyKey, argIndex);
  };
};
