import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserModel } from 'generated/prisma';
import { IAuthenticatedUser } from './authenticatedUser.decorator';
import { app } from 'src/main';
import { UsersService } from 'src/routes/users/users.service';

export type IUser = UserModel;

export const User = createParamDecorator(
  (data: keyof UserModel | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authenticatedUser = request.user as IAuthenticatedUser | undefined;
    if (!authenticatedUser) return undefined;

    const usersService = app.get(UsersService);
    const user = usersService.$createFromAuthenticated(authenticatedUser);

    return data ? user?.[data] : user;
  },
);
