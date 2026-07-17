import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthenticatedUser,
  type IAuthenticatedUser,
} from 'src/auth/authenticatedUser.decorator';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/@me')
  async getMe(@AuthenticatedUser() user: IAuthenticatedUser) {
    return user;
  }
}
