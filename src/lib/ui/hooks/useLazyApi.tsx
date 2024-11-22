'use client';
import { ApiResponse } from '@/lib/shared/types/Api.types';
import { useCallback } from 'react';

type ApiReturnType = Promise<ApiResponse>;
type UseLazyApiApiFn<TArgs = never> = (args: TArgs) => ApiReturnType;

interface UseLazyApiProps<TArgs, TFunction extends UseLazyApiApiFn<TArgs>> {
  args?: TArgs;
  fn: TFunction;
}

export const useLazyApi = <TArgs, TFunction extends UseLazyApiApiFn<TArgs>>({
  args = {} as never,
  fn,
}: UseLazyApiProps<TArgs, TFunction>): [
  () => Promise<ReturnType<TFunction>>,
] => {
  const fetchData = useCallback(async (): Promise<ReturnType<TFunction>> => {
    try {
      const response = await fn(args);

      return response as Awaited<ReturnType<TFunction>>;
    } catch (error) {
      throw error;
    } finally {
    }
  }, [args, fn]);

  return [fetchData];
};
