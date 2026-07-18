import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';

@QueueEventsListener('inference')
export class InferenceEvents extends QueueEventsHost {
  private readonly listeners: Map<string, (successful: boolean) => void> =
    new Map();

  @OnQueueEvent('failed')
  private onFailed(job: { jobId: string; prev?: string }) {
    this.listeners.get(job.jobId)?.(false);
  }

  @OnQueueEvent('completed')
  private onCompleted(job: { jobId: string; prev?: string }) {
    this.listeners.get(job.jobId)?.(true);
  }

  @OnQueueEvent('removed')
  private onRemoved(job: { jobId: string; prev?: string }) {
    this.listeners.get(job.jobId)?.(false);
  }

  public onceFinished(jobId: string, callback: (successful: boolean) => void) {
    this.listeners.set(jobId, callback);
  }
}
