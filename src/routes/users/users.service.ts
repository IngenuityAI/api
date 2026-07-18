import { prisma } from '@ingenuityai/database';
import { Inject, Injectable } from '@nestjs/common';
import { type IAuthenticatedUser } from 'src/auth/authenticatedUser.decorator';

@Injectable()
export class UsersService {
  constructor() {}

  public async $createFromAuthenticated(user: IAuthenticatedUser) {
    const dbUser = await prisma.user.upsert({
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
