import { AppType, RoomNameAdmin } from '@common/index';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewaysService } from './gateways.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConnectionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewaysService: GatewaysService,
    // private readonly eventEmitter: EventEmitter2,
  ) {}

  async handleConnection(client: Socket) {
    const dataAuth = client.handshake.auth;

    // Handle the event when the shoemaker connects
    switch (dataAuth.type) {
      case AppType.shoemakers:
        // this.eventEmitter.emit('shoemaker-update-status', {
        //   isOnline: true,
        //   userId: dataAuth.userId,
        // });
        // check trip pending
        // this.eventEmitter.emit('shoemaker-check-trip-pending', {
        //   userId: dataAuth.userId,
        // });
        // join room and save
        await this.gatewaysService.addSocket(dataAuth.userId, client);
        client.join(dataAuth.userId);
        break;
      case AppType.customers:
        // this.eventEmitter.emit('join-room', {
        //   userId: dataAuth.userId,
        // });
        await this.gatewaysService.addSocket(dataAuth.userId, client);
        client.join(dataAuth.userId);
        break;
      case AppType.admins:
        console.log('join-room', RoomNameAdmin);
        client.join(RoomNameAdmin);
        break;
      default:
        break;
    }

    // if(dataAuth.type ==)
    // Make the socket join the room
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}, ${client.handshake.auth}`);
    const dataAuth = client.handshake.auth;
    if (dataAuth.type == AppType.admins) {
      return client.leave(RoomNameAdmin);
    } else {
      // Remove the socket from the list of connected sockets (shoemaker, )
      this.gatewaysService.removeSocket(client.handshake.auth.userId);
      // Make the socket leave the room
      client.leave(client.handshake.auth.userId);
    }

    // Handle the event when the shoemaker connects
    // if ((client.handshake.auth.type = AppType.shoemakers)) {
    //   this.eventEmitter.emit('shoemaker-update-status', {
    //     isOnline: false,
    //     userId: client.handshake.auth.userId,
    //   });
    // }

    if (client.handshake.auth.type == AppType.customers) {
      // this.eventEmitter.emit('leave-room', {
      //   userId: client.handshake.auth.userId,
      // });
    }
  }
}
