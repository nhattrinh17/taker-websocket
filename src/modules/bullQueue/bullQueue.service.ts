import { QUEUE_NAMES } from '@common/constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import Bull, { Job, Queue } from 'bull';

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.CUSTOMERS_TRIP) private readonly tripQueue: Queue,
  ) {}

  async getJobTrip(jobId: string): Promise<Job<any>> {
    return this.tripQueue.getJob(jobId);
  }

  async addQueueTrip(
    name: string,
    dto: any,
    option?: Bull.JobOptions,
  ): Promise<Bull.Job<any>> {
    return this.tripQueue.add(name, dto, option);
  }
}
