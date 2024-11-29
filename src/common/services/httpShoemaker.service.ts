import { HttpService } from '@nestjs/axios';

export class HttpShoemakerService {
  constructor(private readonly httpService: HttpService) {}
}
