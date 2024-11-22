import { PrismaBaseModel } from '@/lib/shared/models/DatabaseBaseModel';
import { User as UserPrismaModel } from '@prisma/client';

export class UserModel extends PrismaBaseModel implements UserPrismaModel {
  email: string;
  name: null | string;
  password: string;
}
