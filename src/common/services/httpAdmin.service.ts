import { HttpService } from '@nestjs/axios';

export class HttpAdminService {
  constructor(private readonly httpService: HttpService) {}
}
