import 'reflect-metadata';

export const generateArgRequestMetadata = (
  argName: string,
  target: object,
  propertyKey: string | symbol,
  value: unknown,
): void => {
  Reflect.defineMetadata(
    `${propertyKey.toString()}-arg-${argName}`,
    value,
    target,
    propertyKey,
  );
};

export const getArgRequestMetadata = <TValue>(
  argName: string,
  target: object,
  propertyKey: string | symbol,
): TValue | undefined => {
  return Reflect.getMetadata(
    `${propertyKey.toString()}-arg-${argName}`,
    target,
    propertyKey,
  );
};

export const processArgRequestMetadata = <TValue>(
  argName: string,
  value: TValue,
  argsArray: unknown[],
  target: object,
  propertyKey: string | symbol,
): void => {
  if (
    Reflect.hasMetadata(
      `${propertyKey.toString()}-arg-${argName}`,
      target,
      propertyKey,
    )
  ) {
    const bodyArgIndex = Reflect.getMetadata(
      `${propertyKey.toString()}-arg-${argName}`,
      target,
      propertyKey,
    );
    argsArray[bodyArgIndex] = value;
  }
};

export const processAndValidateArgRequestMetadata = <TValue>(
  argName: string,
  value: TValue,
  argsArray: unknown[],
  target: object,
  propertyKey: string | symbol,
): void => {
  if (
    Reflect.hasMetadata(
      `${propertyKey.toString()}-arg-${argName}`,
      target,
      propertyKey,
    )
  ) {
    const bodyArgIndex = Reflect.getMetadata(
      `${propertyKey.toString()}-arg-${argName}`,
      target,
      propertyKey,
    );
    argsArray[bodyArgIndex] = value;
  }
};
