import { config } from '@/lib/shared/config';
import { ApiResponse, ApiResponseError } from '@/lib/shared/types/Api.types';
import { NextRequest, NextResponse } from 'next/server';

const handleError = (
  req: NextRequest,
  error: Error,
): NextResponse<ApiResponse> => {
  return NextResponse.json(
    {
      errors: [
        {
          cause: error?.cause,
          message: error?.message,
          name: error?.name,
          req: {
            body: req.body,
            headers: req.headers,
            method: req.method,
            url: req.url,
          },
          timestamp: Date.now(),
        } as ApiResponseError,
      ],
      result: null,
    } as ApiResponse,
    {
      status: 500,
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const handleMethod = (handler: Function) => {
  return async (req: NextRequest, context: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (config.node.isDevEnv()) {
        console.error({
          error: (error as { message: string } | undefined)?.message || '',
          message: 'Error during endpoint execution',
          req: {
            body: req.body,
            headers: req.headers,
            method: req.method,
            url: req.url,
          },
        });
      }

      throw error;
    }
  };
};

const parseParams = (urlSearchParams: URLSearchParams) => {
  const params: Record<string, unknown> = {};
  urlSearchParams.forEach((value: string, key: string) => {
    try {
      params[key] = JSON.parse(value);
    } catch (_) {
      params[key] = value;
    }
  });

  return params;
};

const setCacheHeaders = (response: NextResponse, maxLifeMs: number) => {
  const maxLifeSeconds = Math.floor(maxLifeMs / 1000);
  response.headers.set('Cache-Control', `max-age=${maxLifeSeconds}`);

  return response;
};

export const ApiUtils = {
  handleError,
  handleMethod,
  parseParams,
  setCacheHeaders,
};
