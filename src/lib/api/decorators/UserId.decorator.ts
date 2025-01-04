import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';

const UserId =
  () =>
  (target: object, propertyKey: string | symbol, argIndex: number): void => {
    generateArgRequestMetadata('userId', target, propertyKey, argIndex);
  };

export default UserId;
