import { Job, Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Chat, Message } from 'generated/prisma';
import { InferenceEvents } from './inference.events';

@Injectable()
export class InferenceService {
  constructor(
    @InjectQueue('inference')
    private readonly inferenceQueue: Queue,
    private readonly inferenceEvents: InferenceEvents,
  ) {}

  async chatCompletion(messages: Message[], chat: Chat, model: string) {
    const job = await this.inferenceQueue.add(
      'chatCompletion',
      {
        messages,
        chat,
        model,
      },
      {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return await this._awaitJobCompletion(job);
  }

  private async _awaitJobCompletion(job: Job) {
    return await new Promise<boolean>((resolve) => {
      this.inferenceEvents.onceFinished(job.id!, (successful) =>
        resolve(successful),
      );
    });
  }
}
