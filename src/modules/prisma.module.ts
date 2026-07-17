import { Global, Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

export const Prisma = 'prisma';

@Global()
@Module({
  providers: [
    {
      provide: Prisma,
      useFactory: () => {
        const adapter = new PrismaPg({
          connectionString: process.env.DATABASE_URL!,
        });

        return new PrismaClient({ adapter });
      },
    },
  ],
  exports: [Prisma],
})
export class PrismaModule {}
