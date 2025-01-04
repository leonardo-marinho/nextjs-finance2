import {ClassConstructor, plainToInstance} from "class-transformer";

import {DEFAULT_API_PAGINATION_PARAMS_TAKE} from "../dtos/ApiPaginationParams.dto";
import {
  ApiEndpointDataType,
  ApiPaginatedData,
  ApiResponse,
} from "../types/Api.types";

const paginatedResponseToInstance = <
  TData extends ApiEndpointDataType,
  TCls extends ApiEndpointDataType
>(
  response: ApiResponse<ApiPaginatedData<TData>>,
  cls: ClassConstructor<TCls>
): ApiResponse<ApiPaginatedData<TCls>> => {
  return {
    ...response,
    result: {
      ...response.result,
      data: plainToInstance(cls, response.result?.data) as unknown as TCls[],
    } as ApiPaginatedData<TCls>,
  };
};

const createPaginatedData = <TData extends ApiEndpointDataType>(
  data: TData[],
  total: number,
  skip: number = 0,
  take: number = DEFAULT_API_PAGINATION_PARAMS_TAKE
): ApiPaginatedData<TData> => {
  return {
    data,
    hasNext: skip + take < total,
    skip,
    take,
    total: total,
  };
};

const resolveData = <TData extends ApiEndpointDataType>(
  response: ApiResponse
): TData => {
  const result = response.result;

  if (!result) return result as TData;

  const resultKeys = Object.keys(result);
  const paginableKeys = ["data", "hasNext", "skip", "take", "total"];
  if (resultKeys.every((key) => paginableKeys.includes(key))) {
    return (result as ApiPaginatedData).data as TData;
  }

  return result as TData;
};

export const ApiResponseUtils = {
  createPaginatedData,
  paginatedResponseToInstance,
  resolveData,
};
