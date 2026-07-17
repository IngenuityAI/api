import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { type IAuthenticatedUser } from 'src/auth/authenticatedUser.decorator';
import { Prisma } from 'src/modules/prisma.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Prisma)
    private readonly prisma: PrismaClient,
  ) {}

  public async $createFromAuthenticated(user: IAuthenticatedUser) {
    const dbUser = await this.prisma.user.upsert({
      create: {
        id: user.userId,
        email: user.email,
        name: user.fullName,
      },
      update: {
        email: user.email,
        name: user.fullName,
      },
      where: {
        id: user.userId,
      },
    });

    return dbUser;
  }
}
