import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Chat, MessageRole, prisma } from '@ingenuityai/database';
import { IUser } from 'src/auth/user.decorator';
import { InferenceService } from 'src/modules/inference/inference.service';

@Injectable()
export class ChatsService {
  constructor(private readonly inferenceService: InferenceService) {}

  async createChat(user: IUser, prompt: string) {
    if (!user) throw new UnauthorizedException('User not authenticated');

    const chat = await prisma.chat.create({
      data: {
        userId: user.id,
      },
    });

    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: MessageRole.USER,
        content: prompt,
      },
    });

    this._processChat(chat.id);

    return chat;
  }

  async getChat(user: IUser, chatId: string) {
    if (!user) throw new UnauthorizedException('User not authenticated');

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    });

    if (!chat || chat.userId !== user.id)
      throw new UnauthorizedException('Chat not found or access denied');

    return chat;
  }

  private async _processChat(chatId: string) {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    });
    if (!chat) throw new NotFoundException('Chat not found');

    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage.role !== MessageRole.USER) return;

    const aiResponse = await this.inferenceService.chatCompletion(
      chat.messages,
      chat,
      'lm-studio/qwen3.5-4b',
    );

    console.log(aiResponse);
  }
}
