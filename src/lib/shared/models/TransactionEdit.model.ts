import { TransactionModel } from '@/lib/shared/models/Transaction.model';
import { $Enums as PrismaEnums } from '@prisma/client';

export class TransactionEditModel extends TransactionModel {
  repeatInstallments: number = 0;
  repeatType: PrismaEnums.TransactionRepeatEnum =
    PrismaEnums.TransactionRepeatEnum.NONE;
  transferAccountId: null | number = null;

  constructor(transaction?: TransactionEditModel | TransactionModel) {
    super();
    this.accountId = transaction?.accountId || 0;
    this.amount = transaction?.amount || 0;
    this.billingDate = transaction?.billingDate || null;
    this.categoryId = transaction?.categoryId || 0;
    this.date = transaction?.date || new Date();
    this.id = transaction?.id || 0;
    this.notes = transaction?.notes || '';
    this.ignore = transaction?.ignore || false;
    this.repeatId = transaction?.repeatId || null;
    this.repeatInstallments =
      (transaction as TransactionEditModel)?.repeatInstallments || 0;
    this.repeatType =
      (transaction as TransactionEditModel)?.repeatType ||
      PrismaEnums.TransactionRepeatEnum.NONE;
    this.paymentMethod =
      transaction?.paymentMethod || PrismaEnums.PaymentMethodEnum.ACCOUNT;
    this.tags = transaction?.tags || '';
    this.type = transaction?.type || PrismaEnums.TransactionTypeEnum.INCOME;
  }
}
