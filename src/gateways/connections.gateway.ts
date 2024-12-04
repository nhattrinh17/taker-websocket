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
import { BullQueueService } from '@modules/bullQueue/bullQueue.service';

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
    private readonly bullQueueService: BullQueueService,
    // private readonly eventEmitter: EventEmitter2,
  ) {}

  async handleConnection(client: Socket) {
    const dataAuth = client.handshake.auth;

    // Handle the event when the shoemaker connects
    switch (dataAuth.type) {
      case AppType.shoemakers:
        this.bullQueueService.addQueueUpdateStatusShoemaker(
          'shoemaker-update-status',
          {
            isOnline: true,
            userId: dataAuth.userId,
          },
        );
        // check trip pending
        this.bullQueueService.addQueueTrip('shoemaker-check-trip-pending', {
          userId: dataAuth.userId,
        });
        // join room and save
        await this.gatewaysService.addSocket(dataAuth.userId, client);
        client.join(dataAuth.userId);
        break;
      case AppType.customers:
        this.bullQueueService.addQueueJoinRoom('join-room-backend', {
          userId: dataAuth.userId,
        });
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

    client.on('LeaveRoom', (room: string) => {
      client.leave(room);
      console.log(`Socket ${client.id}  to leave room ${room}`);
    });

    client.on('JoinRoom', (room: string) => {
      client.leave(room);
      console.log(`Socket ${client.id}  to join room ${room}`);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}, ${client.handshake.auth}`);
    const dataAuth = client.handshake.auth;

    // Handle the event when the shoemaker connects
    // if ((client.handshake.auth.type = AppType.shoemakers)) {
    //   this.eventEmitter.emit('shoemaker-update-status', {
    //     isOnline: false,
    //     userId: client.handshake.auth.userId,
    //   });
    // }
  }
}
