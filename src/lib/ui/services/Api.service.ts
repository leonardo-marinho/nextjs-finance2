import { ApiEndpointDataType, ApiResponse } from '@/lib/shared/types/Api.types';

interface ApiServiceInit<TBody extends ApiEndpointDataType = never>
  extends Omit<RequestInit, 'body'> {
  body?: TBody;
  params?: TBody;
}

export class ApiService {
  async request<
    TResponse extends ApiEndpointDataType,
    TBody extends ApiEndpointDataType = never,
  >(url: string, init: ApiServiceInit<TBody>): Promise<ApiResponse<TResponse>> {
    if (init.params) {
      const searchParams = new URLSearchParams(Object.entries(init.params));
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...init,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    try {
      return (await response.json()) as ApiResponse<TResponse>;
    } catch (error) {
      return {
        result: null as unknown as TResponse,
      };
    }
  }
}
