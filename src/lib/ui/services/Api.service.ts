import { ApiDataType, ApiResponse } from '@/lib/shared/types/Api.types';

interface ApiServiceInit<TBody extends ApiDataType = never>
  extends Omit<RequestInit, 'body'> {
  body?: TBody;
  params?: TBody;
}

export class ApiService {
  async request<
    TResponse extends ApiDataType,
    TBody extends ApiDataType = never,
  >(url: string, init: ApiServiceInit<TBody>): Promise<ApiResponse<TResponse>> {
    if (init.params) {
      const searchParams = new URLSearchParams(Object.entries(init.params));
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...init,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    return (await response.json()) as ApiResponse<TResponse>;
  }
}
