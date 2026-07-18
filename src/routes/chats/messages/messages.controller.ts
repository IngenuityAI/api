import { Controller, Param, Sse } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { type IUser, User } from 'src/auth/user.decorator';

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Sse(':messageId/stream')
  public async messageStream(
    @User() user: IUser,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    return await this.messagesService.messagesStream(user, chatId, messageId);
  }
}
