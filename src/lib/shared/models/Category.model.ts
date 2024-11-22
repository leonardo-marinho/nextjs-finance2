import { PrismaBaseModel } from '@/lib/shared/models/DatabaseBaseModel';
import {
  $Enums as PrismaEnums,
  TransactionCategory as TransactionCategoryPrismaModel,
} from '@prisma/client';

export class TransactionCategoryModel
  extends PrismaBaseModel
  implements TransactionCategoryPrismaModel
{
  name: string;
  type: PrismaEnums.TransactionTypeEnum;

  isPlaceholder(): boolean {
    return this.name === 'Placeholder';
  }

  isTransfer(): boolean {
    return this.type === PrismaEnums.TransactionTypeEnum.TRANSFER;
  } 
}
