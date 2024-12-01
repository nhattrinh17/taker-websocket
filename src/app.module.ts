import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GatewaysModule } from './gateways/gateways.module';
import { BullQueueModule } from './modules/bullQueue/bullQueue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      cache: true,
    }),
    GatewaysModule,
    BullQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
