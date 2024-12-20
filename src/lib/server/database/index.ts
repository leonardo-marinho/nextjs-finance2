import { PrismaStrictUserQueryExtension } from '@/lib/server/database/extensions/PrismaStrictUserQuery.extension';
import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()
  .$extends({
    model: {
      $allModels: {
        findManyAndCount<Model, Args>(
          this: Model,
          args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>,
        ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
          return prisma.$transaction([
            (this as { findMany: Function }).findMany(args),
            (this as { count: Function }).count({ where: (args as any).where }),
          ]);
        },
      },
    },
    name: 'findManyAndCount',
  })
  .$extends(PrismaStrictUserQueryExtension);
