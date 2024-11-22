export class AmountModel {
  amount: number;
  currency: string;

  constructor(amount: number, currency: string = 'R$') {
    this.amount = amount;
    this.currency = currency;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  toString(): string {
    return `${this.currency}${this.amount}`;
  }

  toStringWithSign(): string {
    const absAmount = Math.abs(this.amount);

    return `${this.amount < 0 ? '-' : '+'}${this.currency}${Number(absAmount.toFixed(2)).toLocaleString()}`;
  }
}
