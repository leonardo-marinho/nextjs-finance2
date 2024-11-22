import {
  $Enums as PrismaEnums,
  Transaction as TransactionPrismaModel,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FinanceTrackerUpdateTransactionBody
  implements Partial<TransactionPrismaModel>
{
  @IsNumber()
  accountId: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  categoryId: number;

  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  date: Date;

  @IsOptional()
  @IsBoolean()
  ignore?: boolean | null;

  @IsOptional()
  @IsString()
  notes?: null | string;

  @IsEnum(PrismaEnums.PaymentMethodEnum)
  paymentMethod: PrismaEnums.PaymentMethodEnum;

  @IsOptional()
  @IsNumber()
  repeatInstallments?: number;

  @IsOptional()
  @IsEnum(PrismaEnums.TransactionRepeatEnum)
  repeatType: PrismaEnums.TransactionRepeatEnum;

  @IsOptional()
  @IsString()
  tags?: null | string;

  @IsOptional()
  @IsNumber()
  transferAccountId?: null | number;

  @IsEnum(PrismaEnums.TransactionTypeEnum)
  type: PrismaEnums.TransactionTypeEnum;
}
