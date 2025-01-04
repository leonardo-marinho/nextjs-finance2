import { $Enums as PrismaEnum } from '@prisma/client';

export interface TransactionQueryRawFilters {
  accountId?: number;
  billableEndDate?: Date;
  billableStartDate?: Date;
  endDate?: Date;
  id?: number;
  or?: TransactionQueryRawFilters[];
  paymentMethod?: PrismaEnum.PaymentMethodEnum[];
  pendingOnly?: boolean;
  placeholderOnly?: boolean;
  repeatOnly?: boolean;
  startDate?: Date;
  type?: PrismaEnum.TransactionTypeEnum[];
}
