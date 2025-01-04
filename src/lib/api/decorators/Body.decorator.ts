import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';
import { ClassConstructor } from 'class-transformer';

interface BodyOptions {
  schema?: ClassConstructor<unknown>;
}

const Body = (options?: BodyOptions) => {
  return (
    target: object,
    propertyKey: string | symbol,
    argIndex: number,
  ): void => {
    generateArgRequestMetadata('body', target, propertyKey, argIndex);

    if (options?.schema)
      generateArgRequestMetadata(
        'bodySchema',
        target,
        propertyKey,
        options?.schema,
      );
  };
};

export default Body;
