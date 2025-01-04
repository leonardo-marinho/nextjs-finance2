/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// import { PrismaStrictUserQueryExtension } from '@/lib/api/database/extensions/PrismaStrictUserQuery.extension';
import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>,
      ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
        return prisma.$transaction([
          (this as { findMany: Function }).findMany(args),
          (this as { count: Function }).count({
            where: (args as { where: unknown }).where,
          }),
        ]);
      },
    },
  },
  name: 'findManyAndCount',
});
// .$extends(PrismaStrictUserQueryExtension);
