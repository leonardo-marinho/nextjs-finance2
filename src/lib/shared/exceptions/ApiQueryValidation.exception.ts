import { ValidationError } from 'class-validator';

export class ApiQueryValidationException extends Error {
  constructor(errors?: ValidationError[]) {
    const message =
      errors && errors?.length
        ? errors?.map((error: ValidationError) => error.toString()).join('; ')
        : 'Invalid query';
    super(message);
    this.name = 'ApiQueryValidationException';
  }
}
