export class ApiNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiNotFoundException';
  }
}
