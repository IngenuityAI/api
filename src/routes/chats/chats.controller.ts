import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { type IUser, User } from 'src/auth/user.decorator';

@Controller('/chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async createChat(@User() user: IUser, @Body('prompt') prompt: string) {
    return this.chatsService.createChat(user, prompt);
  }

  @Get(':chatId')
  async getChat(@User() user: IUser, @Param('chatId') chatId: string) {
    return this.chatsService.getChat(user, chatId);
  }
}
