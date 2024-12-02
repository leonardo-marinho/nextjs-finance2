import { TransactionQueryRawFilters } from '@/lib/server/services/Transaction.service';
import { ApiPaginationParamsDto } from '@/lib/shared/dtos/ApiPaginationParams.dto';
import { Prisma, $Enums as PrismaEnums } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class TransactionsFilters implements TransactionQueryRawFilters {
  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsNumber()
  accountId?: number;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  @ValidateIf(
    (args: TransactionsFilters) => args.billableStartDate !== undefined,
  )
  billableEndDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  @ValidateIf((args: TransactionsFilters) => args.billableEndDate !== undefined)
  billableStartDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  @ValidateIf((args: TransactionsFilters) => args.startDate !== undefined)
  endDate?: Date;

  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsArray()
  or?: TransactionsFilters[];

  @IsOptional()
  @IsArray()
  @IsEnum(PrismaEnums.PaymentMethodEnum, { each: true })
  paymentMethod?: PrismaEnums.PaymentMethodEnum[];

  @IsOptional()
  @IsBoolean()
  placeholderOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  repeatOnly?: boolean;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  @ValidateIf((args: TransactionsFilters) => args.endDate !== undefined)
  startDate?: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(PrismaEnums.TransactionTypeEnum, { each: true })
  type?: PrismaEnums.TransactionTypeEnum[];
}

export class GetTransactionsParamsDto extends ApiPaginationParamsDto<
  keyof Prisma.TransactionOrderByWithRelationInput
> {
  @IsOptional()
  @ValidateNested()
  filters?: TransactionsFilters;
}
