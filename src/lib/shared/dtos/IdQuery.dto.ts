import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt } from 'class-validator';

export class IdQueryDto {
  @IsInt()
  @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
  id: number;
}
