export class ApiUnauthorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiUnauthorizedException';
  }
}
