/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { config } from '@/lib/shared/config';
import { ApiResponse, ApiResponseError } from '@/lib/shared/types/Api.types';
import { NextRequest, NextResponse } from 'next/server';

export abstract class ApiService {
  static createHandler(callback: Function) {
    return async (
      req: NextRequest,
      context: unknown,
    ): Promise<NextResponse<ApiResponse>> => {
      try {
        const result = await callback(req, context);

        return this.handleResult(result);
      } catch (error) {
        if (config.node.isDevEnv()) console.error(error);

        return this.handleError(req, error as Error);
      }
    };
  }

  static handleError(
    req: NextRequest,
    error: Error,
  ): NextResponse<ApiResponse> {
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
        result: undefined,
      } as ApiResponse,
      {
        status: 500,
      },
    );
  }

  static handleNotImplemented(req: NextRequest): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Method not implemented',
            name: 'NotImplementedException',
            req: {
              body: req.body,
              headers: req.headers,
              method: req.method,
              url: req.url,
            },
            timestamp: Date.now(),
          } as ApiResponseError,
        ],
        result: undefined,
      } as ApiResponse,
      {
        status: 405,
      },
    );
  }

  static handleResult(result: unknown): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      result: null,
    };

    response.result = result;

    return NextResponse.json(response, {
      status: 200,
    });
  }
}
