import { QUEUE_NAMES } from '@common/constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.LEAVE_ROOM) private readonly sendNowQueue: Queue,
  ) {}
}
