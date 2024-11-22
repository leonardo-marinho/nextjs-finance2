import {
  ApiDataType,
  ApiPaginatedData,
  ApiResponse,
} from '@/lib/shared/types/Api.types';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const paginatedResponseToInstance = <
  TData extends ApiDataType,
  TCls extends ApiDataType,
>(
  response: ApiResponse<ApiPaginatedData<TData>>,
  cls: ClassConstructor<TCls>,
): ApiResponse<ApiPaginatedData<TCls>> => {
  return {
    ...response,
    result: {
      ...response.result,
      data: plainToInstance(cls, response.result?.data) as unknown as TCls[],
    } as ApiPaginatedData<TCls>,
  };
};
