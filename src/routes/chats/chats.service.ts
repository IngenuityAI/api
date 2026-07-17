import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MessageRole, PrismaClient } from 'generated/prisma/client';
import { IUser } from 'src/auth/user.decorator';
import { Prisma } from 'src/modules/prisma.module';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(Prisma)
    private readonly prisma: PrismaClient,
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
}
