import { ValidationError } from 'class-validator';

export class ApiParamsValidationException extends Error {
  constructor(errors?: ValidationError[]) {
    const message =
      errors && errors?.length
        ? errors?.map((error: ValidationError) => error.toString()).join('; ')
        : 'Invalid body';
    super(message);
    this.name = 'ApiParamsValidationException';
  }
}
