import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { UsersModule } from './routes/users/users.module';
import { PrismaModule } from './modules/prisma.module';
import { ChatsModule } from './routes/chats/chats.module';
import { BullModule } from '@nestjs/bullmq';
import { InferenceModule } from './modules/inference/inference.module';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    InferenceModule,
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
