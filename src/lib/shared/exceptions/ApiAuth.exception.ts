export class ApiAuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiAuthException';
  }
}
