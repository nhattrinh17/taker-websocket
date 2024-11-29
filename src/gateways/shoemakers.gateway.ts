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
}
