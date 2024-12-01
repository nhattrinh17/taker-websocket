import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueLeaveRoomDto } from './dto/bullQueue.dto';
import { GatewaysService } from 'src/gateways/gateways.service';
import { QUEUE_NAMES } from '@common/constants';

@Processor(QUEUE_NAMES.LEAVE_ROOM)
export class BullQueueConsumerLeaveRoomService {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Process()
  async processQueue(job: Job<QueueLeaveRoomDto>) {
    const jobData = job.data;

    return this.gatewaysService.forceLeaveRoom(
      jobData.socketId,
      jobData.roomName,
    );
  }
}
