import {ClassConstructor, plainToInstance} from "class-transformer";
import {validate} from "class-validator";

const parsePayload = async <TPayload extends object, TClass>(
  payload: TPayload,
  classConstructor: ClassConstructor<TClass>
): Promise<TClass> => {
  const instance: TClass = plainToInstance(classConstructor, payload);
  await validatePayload(instance as object);

  return instance;
};

const validatePayload = async <TPayload extends object>(
  payload: TPayload
): Promise<void> => {
  const validationErrors = await validate(payload);
  if (validationErrors.length) {
    throw validationErrors;
  }
};

export const ValidationUtils = {
  parsePayload,
  validatePayload,
};
