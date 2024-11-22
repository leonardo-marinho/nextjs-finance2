import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';

export const Token = () => {
  return (
    target: object,
    propertyKey: string | symbol,
    argIndex: number,
  ): void => {
    generateArgRequestMetadata('token', target, propertyKey, argIndex);
  };
};
