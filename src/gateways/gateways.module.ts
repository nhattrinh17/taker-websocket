import { Global, Module } from '@nestjs/common';
import { ConnectionsGateway } from './connections.gateway';
import { GatewaysService } from './gateways.service';
import { CustomersGateway } from './customers.gateway';
import { ShoemakersGateway } from './shoemakers.gateway';
import RedisService from '@common/services/redis.service';
import { BullQueueModule } from '@modules/bullQueue/bullQueue.module';
import { BackEndModule } from '@modules/back-end/back-end.module';

@Global()
@Module({
  imports: [BackEndModule, BullQueueModule],
  providers: [
    //
    ConnectionsGateway,
    GatewaysService,
    CustomersGateway,
    ShoemakersGateway,
    RedisService,
  ],
  exports: [GatewaysService],
})
export class GatewaysModule {}
