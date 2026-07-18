import { Global, Module } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { BullModule } from '@nestjs/bullmq';
import { InferenceEvents } from './inference.events';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'inference',
    }),
  ],
  providers: [InferenceService, InferenceEvents],
  exports: [InferenceService],
})
export class InferenceModule {}
