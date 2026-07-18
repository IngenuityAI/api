import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import Redis from 'ioredis';

@Injectable()
export class RedisService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisSubscriberClient: Redis;
  private redisClient: Redis;

  private readonly listeners: Map<string, Set<(message: string) => void>> =
    new Map();

  constructor() {
    this.redisSubscriberClient = new Redis({
      host: 'localhost',
      port: 6379,
    });

    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async onApplicationBootstrap() {
    await this.redisSubscriberClient.subscribe('inference:chat:stream');

    this.redisSubscriberClient.on('message', (channel, message) => {
      const listeners = this.listeners.get(channel);

      if (listeners) {
        for (const listener of listeners) {
          listener(message);
        }
      }
    });
  }

  async onApplicationShutdown(signal?: string) {
    await this.redisSubscriberClient.quit();
    await this.redisClient.quit();
  }

  public on(channel: string, listener: (message: string) => void) {
    if (!this.listeners.has(channel)) this.listeners.set(channel, new Set());

    this.listeners.get(channel)?.add(listener);

    return () => {
      this.listeners.get(channel)?.delete(listener);
    };
  }

  public get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
}
