import { AccountModel } from '@/lib/shared/models/Account.model';
import { AmountModel } from '@/lib/shared/models/Amount.model';
import { TransactionCategoryModel } from '@/lib/shared/models/Category.model';
import { PrismaBaseModel } from '@/lib/shared/models/DatabaseBaseModel';
import {
  Account as AccountPrismaModel,
  $Enums as PrismaEnums,
  TransactionCategory as TransactionCategoryPrismaModel,
  Transaction as TransactionPrismaModel,
} from '@prisma/client';
import { plainToClass } from 'class-transformer';

export class TransactionModel
  extends PrismaBaseModel
  implements TransactionPrismaModel
{
  protected account?: AccountPrismaModel;
  accountId: number;
  amount: number;
  protected category?: TransactionCategoryPrismaModel;
  categoryId: number;
  date: Date;
  ignore: boolean | null;
  notes: null | string;
  paymentMethod: PrismaEnums.PaymentMethodEnum;
  repeatId: null | number;
  tags: null | string;
  type: PrismaEnums.TransactionTypeEnum;

  getDateString(): string {
    return this.Date.toISOString().split('T')[0];
  }

  isCreditCardTransaction(): boolean {
    return this.paymentMethod === PrismaEnums.PaymentMethodEnum.CREDIT_CARD;
  }

  isExpense(): boolean {
    return this.amount < 0 && !this.Category?.isTransfer();
  }

  isIncome(): boolean {
    return this.amount >= 0 && !this.Category?.isTransfer();
  }

  isPlaceholder(): boolean {
    return this.Category?.isPlaceholder() || false;
  }

  isTransfer(): boolean {
    return this.Category?.isTransfer() || false;
  }

  get Account(): AccountPrismaModel | undefined {
    return plainToClass(AccountModel, this.account);
  }

  get Amount(): AmountModel {
    return new AmountModel(this.amount);
  }

  get Category(): TransactionCategoryModel | undefined {
    return plainToClass(TransactionCategoryModel, this.category);
  }

  get Date(): Date {
    return new Date(this.date);
  }

  get Tags(): string[] {
    return this.tags?.trim()?.split(',') || [];
  }
}
