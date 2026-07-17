import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IAuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}

export const AuthenticatedUser = createParamDecorator(
  (data: keyof IAuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IAuthenticatedUser | undefined;

    return data ? user?.[data] : user;
  },
);
