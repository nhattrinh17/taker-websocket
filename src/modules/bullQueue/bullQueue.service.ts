import { QUEUE_NAMES } from '@common/constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import Bull, { Job, Queue } from 'bull';
import {
  QueueHandleJointRoomBEDto,
  QueueHandleLeaveRoomBEDto,
  QueueJoinRoomDto,
} from './dto/bullQueue.dto';

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.CUSTOMERS_TRIP) private readonly tripQueue: Queue,
    @InjectQueue(QUEUE_NAMES.UPDATE_STATUS)
    private readonly updateStatusQueue: Queue,
    @InjectQueue(QUEUE_NAMES.JOIN_ROOM) private readonly joinRoomQueue: Queue,
    @InjectQueue(QUEUE_NAMES.LEAVE_ROOM) private readonly leaveRoomQueue: Queue,
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

  async addQueueUpdateStatusShoemaker(
    name: string,
    dto: any,
    option?: Bull.JobOptions,
  ): Promise<Bull.Job<any>> {
    return this.updateStatusQueue.add(name, dto, option);
  }

  async addQueueJoinRoom(
    name: string,
    dto: QueueJoinRoomDto | QueueHandleJointRoomBEDto,
    option?: Bull.JobOptions,
  ): Promise<Bull.Job<any>> {
    return this.joinRoomQueue.add(name, dto, option);
  }

  async addQueueLeaveRoom(
    name: string,
    dto: QueueHandleLeaveRoomBEDto,
    option?: Bull.JobOptions,
  ): Promise<Bull.Job<any>> {
    return this.leaveRoomQueue.add(name, dto, option);
  }
}
