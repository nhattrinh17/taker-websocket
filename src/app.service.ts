import { Injectable } from '@nestjs/common';
import { SendMessageToRoom } from './dto/data-call-wsk.dto';
import { GatewaysService } from './gateways/gateways.service';

@Injectable()
export class AppService {
  constructor(private readonly gatewaysService: GatewaysService) {}
  getHello(): string {
    return 'Hello World!';
  }

  sendMessageToRoom(dto: SendMessageToRoom) {
    if (dto.roomName && dto.event && dto.data) {
      return this.gatewaysService.emitToRoomWithServer(
        dto.roomName,
        dto.event,
        dto.data,
      );
    }
    return false;
  }
}
