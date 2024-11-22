export class ApiInternalServerErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiInternalServerErrorException';
  }
}
