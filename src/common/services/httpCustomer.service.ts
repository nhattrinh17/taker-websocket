import { HttpService } from '@nestjs/axios';

export class HttpCustomerService {
  constructor(private readonly httpService: HttpService) {}
}
