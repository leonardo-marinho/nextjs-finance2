/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, PrismaPromise } from '@prisma/client';

export const PrismaStrictUserQueryExtension = {
  query: {
    $allOperations({
      args,
      model,
      operation,
      query,
    }: {
      args: any;
      model?: string | undefined;
      operation: string;
      query: (args: any) => PrismaPromise<any>;
    }): PrismaPromise<any> {
      if (
        model === Prisma.ModelName.User ||
        !(operation.search('/find/i') >= 0)
      )
        return query(args);

      if (!args?.where?.userId)
        throw new Error(
          `userId is required for model ${model} with operation ${operation}. This is a strict user related query.`,
        );

      return query(args);
    },
  },
};
