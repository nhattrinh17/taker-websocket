import { Global, Module } from '@nestjs/common';
import { ConnectionsGateway } from './connections.gateway';
import { GatewaysService } from './gateways.service';
import { CustomersGateway } from './customers.gateway';
import { ShoemakersGateway } from './shoemakers.gateway';
import RedisService from '@common/services/redis.service';

@Global()
@Module({
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
