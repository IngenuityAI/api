import { prisma } from '@ingenuityai/database';
import {
  BadRequestException,
  Injectable,
  MessageEvent,
  NotFoundException,
} from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { type IUser } from 'src/auth/user.decorator';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class MessagesService {
  private readonly messageStreams: Map<string, Subscriber<MessageEvent>> =
    new Map();

  constructor(private readonly redisService: RedisService) {
    redisService.on('inference:chat:stream', (message) => {
      this._processStreamEvent(message);
    });
  }

  public async messagesStream(user: IUser, chatId: string, messageId: string) {
    if (!user) throw new Error('User not authenticated');

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: user.id },
      include: { messages: true },
    });
    if (!chat) throw new NotFoundException('Chat not found or access denied');

    const message = chat.messages.find((msg) => msg.id === messageId);
    if (!message) throw new NotFoundException('Message not found');
    if (!message.isGenerating)
      throw new BadRequestException('Message is not being generated');

    const obs = new Observable((sub) => {
      this.messageStreams.set(`${chatId}:${messageId}`, sub);

      this.redisService
        .get(`inference:chat:${chatId}:${messageId}`)
        .then((c) => {
          if (!c) return;
          const chunks = c.split(';').filter((chunk) => chunk.trim() !== '');

          for (const chunk of chunks) {
            const parsedChunk = JSON.parse(chunk.replaceAll('\\;', ';'));

            sub.next({
              type: 'token',
              data: JSON.stringify({ content: parsedChunk }),
            });
          }
        });
    });

    return obs;
  }

  private async _processStreamEvent(message: string) {
    const parsedMessage = JSON.parse(message);
    const { chatId, messageId, type, content } = parsedMessage;

    const streamKey = `${chatId}:${messageId}`;
    const subscriber = this.messageStreams.get(streamKey);

    if (subscriber) {
      subscriber.next({
        type: type as string,
        data: JSON.stringify({ content }),
      });
    }
  }
}
