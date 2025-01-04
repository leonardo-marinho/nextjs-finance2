import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';

export type ApiEndpointDataType = boolean | null | number | object | string;

export interface ApiPaginatedData<
  TData extends ApiEndpointDataType = ApiEndpointDataType,
> {
  data: TData[];
  hasNext?: boolean;
  skip: number;
  take: number;
  total: number;
}

export interface ApiResponse<
  TResult extends ApiEndpointDataType | ApiPaginatedData =
    | ApiEndpointDataType
    | ApiPaginatedData,
> {
  errors?: ApiResponseError[] | null;
  result: TResult;
}

export interface ApiResponseError {
  cause?: string;
  message: string;
  name: string;
  req: {
    body: null | ReadableStream<Uint8Array>;
    headers: Headers;
    method: IncomingMessage['method'];
    query: NextApiRequest['query'];
    url: IncomingMessage['url'];
  };
  timestamp: number;
}
