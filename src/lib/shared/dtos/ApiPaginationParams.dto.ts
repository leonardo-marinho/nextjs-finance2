import { Prisma } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const DEFAULT_API_PAGINATION_PARAMS_TAKE = 10;

export class ApiPagination<TFields extends string = string> {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
  skip?: number = 0;

  @IsOptional()
  @IsArray()
  sort?: ApiPaginationSortOrder<TFields>[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
  take?: number;
}

export class ApiPaginationParamsDto<TFields extends string = string> {
  @IsOptional()
  pagination?: ApiPagination<TFields>;
}

export class ApiPaginationSortOrder<TFields extends string = string> {
  @IsOptional()
  @IsString()
  field: TFields;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Prisma.SortOrder))
  order: Prisma.SortOrder = Prisma.SortOrder.desc;
}
