import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';

export type ApiDataType = boolean | number | Object | string;

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

export interface ApiResponse<TResult extends ApiDataType = any> {
  errors?: ApiResponseError[] | null;
  result?: null | TResult;
}

export interface ApiPaginatedData<TData extends ApiDataType> {
  data: TData[];
  hasNext: boolean;
  skip: number;
  take: number;
  total: number;
}
