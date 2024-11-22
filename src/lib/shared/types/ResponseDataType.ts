import { ArrayType } from '@/lib/shared/types/Array';

export type ResponseDataType<TResponse extends { data: unknown }> =
  TResponse extends {
    data: infer TData;
  }
    ? ArrayType<TData, TData>
    : never;
