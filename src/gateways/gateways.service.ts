import { SOCKET_PREFIX } from '@common/constants/app.constant';
import RedisService from '@common/services/redis.service';
import { FindShoemakerWithSocketDto } from '@modules/back-end/dto/request-backend.dto';
import { HttpCustomerService } from '@modules/back-end/httpCustomer.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class GatewaysService implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly redis: RedisService,
    private readonly httpCustomerService: HttpCustomerService,
  ) {}

  async onModuleInit() {
    const redisPubClient = this.redis.getClient(); // Redis publisher client
    const redisSubClient = redisPubClient.duplicate(); // Redis subscriber client

    // Gắn Redis Adapter vào Socket.IO
    this.server.adapter(createAdapter(redisPubClient, redisSubClient));
    console.log('Redis Adapter initialized for WebSocket');
  }

  public async addSocket(id: string, socket: Socket) {
    await this.redis.set(`${SOCKET_PREFIX}${id}`, socket.id);
    // this.sockets.set(id, socket);
  }

  public async addSocketAdmin(socket: Socket) {
    return this.redis.sadd(`${SOCKET_PREFIX}admins`, socket.id);
  }

  public async removeSocketAdmin(socket: Socket) {
    return this.redis.srem(`${SOCKET_PREFIX}admins`, socket.id);
  }

  public async removeSocket(id: string) {
    // this.sockets.delete(id);
    await this.redis.del(`${SOCKET_PREFIX}${id}`);
  }

  public async getSocket(id: string) {
    const socketId = await this.redis.get(`${SOCKET_PREFIX}${id}`);
    console.log('socketId', socketId);
    if (socketId) return this.server.sockets.sockets.get(socketId);
    return null;
  }

  public async emitToRoomWithServer(
    roomName: string,
    event: string,
    data: any,
  ) {
    try {
      const room = this.server.sockets.adapter.rooms.get(roomName);
      if (room && room.size > 0) {
        this.server.to(roomName).emit(event, data);
      } else {
        console.log(
          `Room '${roomName}' is empty. Event '${event}' was not sent.`,
        );
      }
    } catch (error) {
      console.log(
        '🚀 ~ GatewaysService ~ emitToRoomWithServer ~ error:',
        error,
      );
    }
  }

  public async forceLeaveRoom(socketId: string, room: string) {
    // Gửi sự kiện tới tất cả các nodes qua Redis Adapter
    this.server.to(socketId).emit('LeaveRoom', room);

    console.log(
      `Broadcasted forceLeaveRoom for Socket ${socketId} and Room ${room}`,
    );
  }

  public async forceJoinRoom(socketId: string, room: string) {
    // Gửi sự kiện tới tất cả các nodes qua Redis Adapter
    this.server.to(socketId).emit('JoinRoom', room);

    console.log(`Broadcasted JoinRoom for Socket ${socketId} and Room ${room}`);
  }

  public async requestFindShoemaker(
    token: string,
    dto: FindShoemakerWithSocketDto,
  ) {
    return this.httpCustomerService.requestFindShoemaker(token, dto);
  }
}
