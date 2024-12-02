import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueJoinRoomDto, QueueLeaveRoomDto } from './dto/bullQueue.dto';
import { GatewaysService } from 'src/gateways/gateways.service';
import { QUEUE_NAMES } from '@common/constants';

@Processor(QUEUE_NAMES.LEAVE_ROOM)
export class BullQueueConsumerLeaveRoomService {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Process('leave-room-websocket')
  async processQueue(job: Job<QueueLeaveRoomDto>) {
    const jobData = job.data;

    return this.gatewaysService.forceLeaveRoom(
      jobData.socketId,
      jobData.roomName,
    );
  }
}

@Processor(QUEUE_NAMES.JOIN_ROOM)
export class BullQueueConsumerJoinRoomService {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Process('join-room-websocket')
  async processQueue(job: Job<QueueJoinRoomDto>) {
    const jobData = job.data;

    return this.gatewaysService.forceJoinRoom(
      jobData.socketId,
      jobData.roomName,
    );
  }
}
