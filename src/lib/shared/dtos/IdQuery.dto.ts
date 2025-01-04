import { Transform, TransformFnParams } from 'class-transformer';

export class IdQueryDto {
  @Transform((params: TransformFnParams) => {
    console.log('params', params);

    return Number.parseInt(params.value, 10);
  })
  id: number;
}
