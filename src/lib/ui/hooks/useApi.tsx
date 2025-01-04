import { ApiResponse } from '@/lib/shared/types/Api.types';
import { useCallback, useEffect, useState } from 'react';

export interface UseApiData<TFunction extends UseApiApiFn, TArgs> {
  data: ResponseDataType<TFunction>;
  error: ResponseErrorType<TFunction>;
  loading: boolean;
  request: (args: TArgs) => void;
  requestAsync: (args: TArgs) => ReturnType<TFunction>;
}
type ApiReturnType = Promise<ApiResponse>;
type ResponseDataType<TFunction> = ResponseType<TFunction>['result'];
type ResponseErrorType<TFunction> = ResponseType<TFunction>['errors'];
type ResponseType<TFunction> = TFunction extends () => Promise<
  infer R extends Awaited<ApiResponse>
>
  ? R
  : never;

type UseApiApiFn = () => ApiReturnType;

interface UseApiOptions<TArgs> {
  args?: TArgs;
  lazy?: boolean;
}

interface UseApiProps<TFunction extends UseApiApiFn, TArgs> {
  fn: (args: TArgs) => ReturnType<TFunction>;
  options?: UseApiOptions<TArgs>;
}

export const useApi = <
  TFunction extends UseApiApiFn,
  TArgs = never | undefined,
>({
  fn,
  options = { lazy: false },
}: UseApiProps<TFunction, TArgs>): UseApiData<TFunction, TArgs> => {
  const [data, setData] = useState<ResponseDataType<TFunction>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ResponseErrorType<TFunction>>(null);

  const request = useCallback(
    (args: TArgs): void => {
      setLoading(true);
      fn(args)
        .then((response: ApiResponse) => {
          setError(response?.errors);
          setData(response?.result);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [fn],
  );

  useEffect(() => {
    if (!!options?.lazy) return;

    request(options?.args || ({} as TArgs));
  }, [options?.lazy]);

  return { data, error, loading, request, requestAsync: fn };
};
