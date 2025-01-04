import {ApiPaginationParamsDto} from "@/lib/shared/dtos/ApiPaginationParams.dto";

import {
  CreateArgumentDecoratorOptions,
  DecoratorsUtils,
} from "../utils/Decorators.utils";

export type ArgDecoratorName =
  | "body"
  | "cookies"
  | "pagination"
  | "params"
  | "query"
  | "req"
  | "userId";

export const Req = (options?: never) =>
  DecoratorsUtils.createArgumentDecorator("req", options);

export const Body = (options?: CreateArgumentDecoratorOptions) =>
  DecoratorsUtils.createArgumentDecorator("body", options);

export const Query = (options?: CreateArgumentDecoratorOptions) =>
  DecoratorsUtils.createArgumentDecorator("query", options);

export const Params = (options?: CreateArgumentDecoratorOptions) =>
  DecoratorsUtils.createArgumentDecorator("params", options);

export const UserId = (options?: never) =>
  DecoratorsUtils.createArgumentDecorator("userId", options);

export const Pagination = (options?: never) =>
  DecoratorsUtils.createArgumentDecorator("pagination", {
    schema: ApiPaginationParamsDto,
  });

export const Cookies = (options?: never) =>
  DecoratorsUtils.createArgumentDecorator("cookies", options);
