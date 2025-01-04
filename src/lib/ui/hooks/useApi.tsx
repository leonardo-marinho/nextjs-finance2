'use client';

import { ApiResponse } from '@/lib/shared/types/Api.types';
import { ApiResponseUtils } from '@/lib/shared/utils/ApiResponse.utils';
import { useCallback, useEffect, useState } from 'react';

type InferResultType<TResponse extends ApiResponse> =
  TResponse['result'] extends { data: infer TData }
    ? TData
    : TResponse['result'];

interface UseApiOptions {
  lazy?: boolean;
  skip?: boolean;
}

export const useApi = <TResponse extends ApiResponse, TArgs>(
  callback: (...args: TArgs[]) => Promise<TResponse>,
  options: UseApiOptions = {},
) => {
  const { lazy = false, skip = false } = options;
  const [data, setData] = useState<InferResultType<TResponse>>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const call = () => {
    callAsync();
  };
  const callAsync = useCallback(
    async (...args: TArgs[]) => {
      if (skip) return;

      setIsLoading(true);
      try {
        const response = await callback(...args);
        const result = ApiResponseUtils.resolveData(
          response,
        ) as InferResultType<TResponse>;
        setData(result);

        return response;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [callback, skip],
  );

  useEffect(() => {
    if (!lazy && !skip) {
      callAsync();
    }
  }, [lazy, skip, callAsync]);

  return {
    call,
    callAsync,
    data,
    error,
    isLoading,
  };
};
