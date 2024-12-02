import { isValidDate } from '@/lib/shared/utils/Date.utils';
import { isStrictNullOrUndefined } from '@/lib/shared/utils/Value';
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
  Min,
  ValidateIf,
} from 'class-validator';

export class FinanceTrackerUpdateTransactionBody
  implements Partial<TransactionPrismaModel>
{
  @IsNumber()
  accountId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value?: null | string }) =>
    isStrictNullOrUndefined(value) || !isValidDate(new Date(value!))
      ? null
      : new Date(value!),
  )
  @ValidateIf(
    (args: FinanceTrackerUpdateTransactionBody) =>
      args.paymentMethod !== PrismaEnums.PaymentMethodEnum.CREDIT_CARD,
  )
  billingDate?: Date | null;

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
