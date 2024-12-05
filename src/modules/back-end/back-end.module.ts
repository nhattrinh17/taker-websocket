import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpShoemakerService } from './httpShoemaker.service';
import { HttpCustomerService } from './httpCustomer.service';
import { HttpAdminService } from './httpAdmin.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    //
    HttpShoemakerService,
    HttpCustomerService,
    HttpAdminService,
  ],
  exports: [
    //
    HttpShoemakerService,
    HttpCustomerService,
    HttpAdminService,
  ],
})
export class BackEndModule {}
