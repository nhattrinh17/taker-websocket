import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMessageToRoom } from './dto/data-call-wsk.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-message')
  sendMessage(@Body() body: SendMessageToRoom) {}
}
