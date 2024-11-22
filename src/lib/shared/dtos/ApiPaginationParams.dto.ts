import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_API_PAGINATION_PARAMS_TAKE = 10;

export class ApiPaginationParamsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
  take?: number;
}
