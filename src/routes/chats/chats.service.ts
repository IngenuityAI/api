import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Chat, MessageRole, PrismaClient } from 'generated/prisma/client';
import { IUser } from 'src/auth/user.decorator';
import { InferenceService } from 'src/modules/inference/inference.service';
import { Prisma } from 'src/modules/prisma.module';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(Prisma)
    private readonly prisma: PrismaClient,
    private readonly inferenceService: InferenceService,
  ) {}

  async createChat(user: IUser, prompt: string) {
    if (!user) throw new UnauthorizedException('User not authenticated');

    const chat = await this.prisma.chat.create({
      data: {
        userId: user.id,
      },
    });

    await this.prisma.message.create({
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

    const chat = await this.prisma.chat.findUnique({
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
    const chat = await this.prisma.chat.findUnique({
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
      'gemma3:4b',
    );

    console.log(aiResponse);
  }
}
