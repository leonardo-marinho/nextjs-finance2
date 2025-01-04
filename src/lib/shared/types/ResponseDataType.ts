import { ArrayType } from '@/lib/shared/types/Array.types';

export type ResponseDataType<TResponse extends { data: unknown }> =
  TResponse extends {
    data: infer TData;
  }
    ? ArrayType<TData, TData>
    : never;
