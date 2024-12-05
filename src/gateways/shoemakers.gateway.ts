// import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewaysService } from './gateways.service';

import { AppType, EventEmitSocket, RoomNameAdmin } from '@common/index';
import { BullQueueService } from '@modules/bullQueue/bullQueue.service';
import RedisService from '@common/services/redis.service';
import { DataShoemakerResponseTripDto } from 'src/dto/gateway.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ShoemakersGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewaysService: GatewaysService,
    private readonly bullQueueService: BullQueueService,
    private readonly redisService: RedisService,
    // private readonly eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage('shoemaker-update-location')
  handleEvent(
    @MessageBody()
    data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      'shoemaker-update-location',
      client.id,
      client.handshake.auth.userId,
      client.handshake.auth.type,
      data,
    );

    // TODO: enable when 30 day(1/12)
    // TODO: update emit event
    // if (client.handshake.auth.type == AppType.shoemakers) {
    // }
    // this.eventEmitter.emit('shoemaker-update-location', {
    //   ...data,
    //   userId: client.handshake.auth.userId,
    // });

    // send data to admins
    this.gatewaysService.emitToRoomWithServer(
      RoomNameAdmin,
      EventEmitSocket.UpdateLocationShoemaker,
      {
        userId: client.handshake.auth.userId,
        ...data,
      },
    );
  }

  @SubscribeMessage('online')
  handleOnline(
    @MessageBody()
    data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('online', client.handshake?.auth?.userId, data);
  }

  @SubscribeMessage('shoemaker-start-schedule')
  async handleEventShoemakerStartSchedule(
    @MessageBody()
    data: {
      customerId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const customerId = data?.customerId;
    const shoemakerId = client.handshake.auth.userId;
    if (customerId && shoemakerId) {
      const socketCustomer = await this.gatewaysService.getSocket(customerId);
      socketCustomer && socketCustomer.join(shoemakerId);
    }
  }

  @SubscribeMessage('shoemaker-response-trip')
  async handleEventShoemakerResponseTrip(
    @MessageBody()
    data: DataShoemakerResponseTripDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { accepted, jobId, tripId } = data;

    if (!jobId && !tripId) return;
    const currentJob = await this.bullQueueService.getJobTrip(jobId);
    const shoemakerId = client.handshake.auth.userId;
    console.log('currentJob', currentJob?.getState());
    if (!currentJob) {
      client.emit('trip-update', {
        type: 'customer-cancel',
        message:
          'The trip has been cancelled by the customer or has been accepted. You can now accept new trips.',
        tripId: tripId,
      });
    }
    const statusTrip = await this.redisService.hget(
      `trips:info:${tripId}`,
      'status',
    );
    if (statusTrip == 'pending') {
      // add shoemaker interactive
      await this.redisService.sadd(`trips:interactive:${tripId}`, shoemakerId);
      if (accepted) {
        await Promise.all([
          this.redisService.hset(`trips:info:${tripId}`, 'status', 'received'),
          this.redisService.hset(
            `trips:info:${tripId}`,
            'shoemakerId',
            shoemakerId,
          ),
        ]);

        // Phát sự kiện qua Redis Pub/Sub
        await this.redisService.publish(
          'shoemaker-response-trip',
          JSON.stringify({
            event: 'trip-accepted',
            shoemakerId,
            ...data,
          }),
        );
      } else {
        this.bullQueueService.addQueueTrip('shoemaker-cancellation', {
          tripId,
          shoemakerId,
        });
      }
    } else if (statusTrip == 'received') {
      client.emit('trip-update', {
        type: 'accepted',
        message: 'Trip has been accepted by the customer.',
        tripId: tripId,
      });
    }
  }
}
