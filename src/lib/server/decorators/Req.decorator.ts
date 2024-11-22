import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';

const Req = (
  target: object,
  propertyKey: string | symbol,
  argIndex: number,
): void => {
  generateArgRequestMetadata('req', target, propertyKey, argIndex);
};

export default Req;
