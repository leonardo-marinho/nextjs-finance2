import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';
import { ClassConstructor } from 'class-transformer';

interface QueryOptions {
  schema?: ClassConstructor<unknown>;
}

const Query = (options?: QueryOptions) => {
  return (
    target: object,
    propertyKey: string | symbol,
    argIndex: number,
  ): void => {
    generateArgRequestMetadata('query', target, propertyKey, argIndex);

    if (options?.schema)
      generateArgRequestMetadata(
        'querySchema',
        target,
        propertyKey,
        options?.schema,
      );
  };
};

export default Query;
