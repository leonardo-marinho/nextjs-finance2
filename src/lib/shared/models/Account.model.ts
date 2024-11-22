import { PrismaBaseModel } from '@/lib/shared/models/DatabaseBaseModel';
import { $Enums, Account as AccountPrismaModel } from '@prisma/client';

export class AccountModel
  extends PrismaBaseModel
  implements AccountPrismaModel
{
  name: string;
  notes: null | string;
  type: $Enums.AccountTypeEnum;
}
