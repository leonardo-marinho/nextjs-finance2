import { ValidationError } from 'class-validator';

export class ApiParamsValidationException extends Error {
  constructor(schemaName: string, errors?: ValidationError[]) {
    let message = `${schemaName} -`;
    message +=
      errors && errors?.length
        ? errors?.map((error: ValidationError) => error.toString()).join('; ')
        : 'Invalid params';
    super(message);
    this.name = 'ApiParamsValidationException';
  }
}
