import 'reflect-metadata';
import _ from 'lodash';
import { NextRequest } from 'next/server';

import { ArgDecoratorName } from '../types/Decorator.types';
import { ValidationUtils } from './Validation.utils';

export interface CreateArgumentDecoratorOptions {
  schema: object;
}

export type PropertyKey = string | symbol;

type CreateClassDecoratorFn = (target: object) => void;

type CreateMethodDecoratorFn<TNextReturn> = (
  target: object,
  propertyKey: PropertyKey,
  descriptor: PropertyDescriptor,
  next: (args?: []) => Promise<TNextReturn>,
  args: [NextRequest, { params: Promise<Record<string, string>> }],
) => void;

const applyArgumentDecorator = async <TValue extends object>(
  args: Array<TValue>,
  target: object,
  propertyKey: PropertyKey,
  argumentName: ArgDecoratorName,
  getter: () => TValue,
): Promise<[TValue, number] | null> => {
  const resolvedArgument = await DecoratorsUtils.resolveArgumentDecorator(
    argumentName,
    target,
    propertyKey,
    getter,
  );

  if (!resolvedArgument) return null;

  const [value, index] = resolvedArgument;
  args[index] = value;

  return resolvedArgument;
};

const createArgumentDecorator = (
  argumentName: ArgDecoratorName,
  options?: CreateArgumentDecoratorOptions,
) => {
  return (
    target: object,
    propertyKey: PropertyKey,
    propertyIndex: number,
  ): void => {
    defineMetadata(
      createArgumentMetadataKey(argumentName),
      propertyIndex,
      target,
      propertyKey,
    );

    if (options?.schema)
      defineMetadata(
        createArgumentSchemaMetadataKey(argumentName),
        options.schema,
        target,
        propertyKey,
      );
  };
};

const createArgumentMetadataKey = (argumentName: string): string =>
  `arg_${argumentName}`;

const createArgumentSchemaMetadataKey = (argumentName: string): string =>
  `arg_${argumentName}_schema`;

const createClassDecorator =
  (fn: CreateClassDecoratorFn) => (target: object) => {
    fn(target);
  };

const createMethodDecorator =
  <TNextReturn>(fn: CreateMethodDecoratorFn<TNextReturn>) =>
  (
    target: object,
    propertyKey: PropertyKey,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = (
      ...originalArgs: [
        NextRequest,
        { params: Promise<Record<string, string>> },
      ]
    ) => {
      return fn(
        target,
        propertyKey,
        descriptor,
        (args?: []): Promise<TNextReturn> =>
          originalMethod.apply(this, args || args),
        originalArgs,
      );
    };

    return descriptor;
  };

const defineMetadata = <TValue>(
  key: string,
  value: TValue,
  target: object,
  propertyKey: PropertyKey,
): void => {
  Reflect.defineMetadata(key, value, target, propertyKey);
};

const getMetadata = <TData>(
  key: string,
  target: object,
  propertyKey: PropertyKey,
): TData => Reflect.getMetadata(key, target, propertyKey);

const registerMetadataKey = (
  key: string,
  target: object,
  propertyKey: PropertyKey,
): void => Reflect.defineMetadata(key, '', target, propertyKey);

const resolveArgumentDecorator = async <TValue extends object>(
  argumentName: ArgDecoratorName,
  target: object,
  propertyKey: PropertyKey,
  getter: () => TValue,
  skipValidation = false,
): Promise<[TValue, number] | null> => {
  const metadataValue = Reflect.getMetadata(
    createArgumentMetadataKey(argumentName),
    target,
    propertyKey,
  );

  if (_.isNil(metadataValue)) return null;

  let value: TValue;
  try {
    value = await getter();
  } catch (error) {
    throw new Error(`Error when resolving ${argumentName}`);
  }

  const returnPair = [value, metadataValue] as [TValue, number];
  if (skipValidation) return returnPair;

  const schema = Reflect.getMetadata(
    createArgumentSchemaMetadataKey(argumentName),
    target,
    propertyKey,
  );

  if (schema) {
    try {
      returnPair[0] = await ValidationUtils.parsePayload(value, schema);
    } catch (error) {
      throw new Error(`Invalid payload for argument ${argumentName}. ${error}`);
    }
  }

  return returnPair;
};

export const DecoratorsUtils = {
  applyArgumentDecorator,
  createArgumentDecorator,
  createClassDecorator,
  createMethodDecorator,
  defineMetadata,
  getMetadata,
  registerMetadataKey,
  resolveArgumentDecorator,
};
