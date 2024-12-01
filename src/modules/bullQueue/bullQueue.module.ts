import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { BullQueueService } from './bullQueue.service';
import { BullQueueConsumerLeaveRoomService } from './bullQueueConsumerService';
import { QUEUE_NAMES } from '@common/constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        prefix: `{bull-queue}`,
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: parseInt(configService.get('QUEUE_PORT'), 10),
          password: String(configService.get('QUEUE_PASS')),
        },
        defaultJobOptions: {
          attempts: 20,
          removeOnComplete: 100,
          removeOnFail: {
            age: 60 * 60,
            count: 100,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.LEAVE_ROOM,
    }),
  ],
  providers: [BullQueueService, BullQueueConsumerLeaveRoomService],
  exports: [BullQueueService],
})
export class BullQueueModule {}
