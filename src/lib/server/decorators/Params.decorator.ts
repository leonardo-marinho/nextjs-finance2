import { generateArgRequestMetadata } from '@/lib/shared/utils/Decorator.utils';
import { ClassConstructor } from 'class-transformer';

interface ParamsOptions {
  schema?: ClassConstructor<unknown>;
}

const Params = (options?: ParamsOptions) => {
  return (
    target: object,
    propertyKey: string | symbol,
    argIndex: number,
  ): void => {
    generateArgRequestMetadata('params', target, propertyKey, argIndex);

    if (options?.schema)
      generateArgRequestMetadata(
        'paramsSchema',
        target,
        propertyKey,
        options?.schema,
      );
  };
};

export default Params;
