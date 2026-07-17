import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthenticatedUser,
  type IAuthenticatedUser,
} from 'src/auth/authenticatedUser.decorator';
import { type IUser, User } from 'src/auth/user.decorator';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/@me')
  async getMe(@User() user: IUser) {
    return user;
  }
}
