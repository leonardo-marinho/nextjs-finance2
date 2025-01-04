import { validateApiPayload } from '@/lib/api/utils/Validation.utils';
import { DEFAULT_API_PAGINATION_PARAMS_TAKE } from '@/lib/shared/dtos/ApiPaginationParams.dto';
import { ApiDataType, ApiPaginatedData } from '@/lib/shared/types/Api.types';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const parsePayload = async <TPayload extends object, TClass>(
  payload: TPayload,
  classConstructor: ClassConstructor<TClass>,
): Promise<TClass> => {
  const instance: TClass = plainToInstance(classConstructor, payload);
  await validateApiPayload(instance as object);

  return instance;
};

export const createPaginatedData = <TData extends ApiDataType>(
  data: TData[],
  total: number,
  skip: number = 0,
  take: number = DEFAULT_API_PAGINATION_PARAMS_TAKE,
): ApiPaginatedData<TData> => {
  return {
    data,
    hasNext: skip + take < total,
    skip,
    take,
    total: total,
  };
};
