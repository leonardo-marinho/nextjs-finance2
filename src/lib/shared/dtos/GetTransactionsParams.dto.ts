import { ApiPaginationParamsDto } from '@/lib/shared/dtos/ApiPaginationParams.dto';
import { Prisma, $Enums as PrismaEnums } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class GetTransactionsParamsDto extends ApiPaginationParamsDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsNumber()
  accountId?: number;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  @ValidateIf((args: GetTransactionsParamsDto) => args.startDate !== undefined)
  endDate?: Date;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value.split(','))
  @IsArray()
  @IsEnum(PrismaEnums.PaymentMethodEnum, { each: true })
  paymentMethod?: PrismaEnums.PaymentMethodEnum[] = [];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: string }) =>
    value === 'true' ? true : false,
  )
  repeatOnly?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Prisma.SortOrder))
  sortOrder?: Prisma.SortOrder = Prisma.SortOrder.desc;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  @ValidateIf((args: GetTransactionsParamsDto) => args.endDate !== undefined)
  startDate?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['EXPENSE', 'INCOME', 'TRANSFER'])
  type?: PrismaEnums.TransactionTypeEnum;
}
