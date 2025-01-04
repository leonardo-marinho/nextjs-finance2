import { RequestContextManager } from '@/lib/api/helpers/RequestContextManager';
import { Prisma } from '@prisma/client';

const whitelistModels = ['User'];

export const PrismaStrictUserQueryExtension = Prisma.defineExtension({
  name: 'StrictUserQuery',
  query: {
    $allOperations({ args, model, operation, query }) {
      if (
        whitelistModels.includes(model!) ||
        !operation.match(/find|update|delete|count/i)
      ) {
        return query(args);
      }

      const context = RequestContextManager.get();
      if (!context?.userId) {
        throw new Error(
          'userId is required but not found in the request context',
        );
      }

      args.where = {
        ...args.where,
        userId: context.userId,
      };

      return query(args);
    },
  },
});
