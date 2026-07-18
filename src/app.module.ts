import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { UsersModule } from './routes/users/users.module';
import { ChatsModule } from './routes/chats/chats.module';
import { BullModule } from '@nestjs/bullmq';
import { InferenceModule } from './modules/inference/inference.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    PassportModule,
    InferenceModule,
    RedisModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // Routes
    UsersModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
