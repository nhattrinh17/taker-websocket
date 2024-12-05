import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpAdminService {
  constructor(private readonly httpService: HttpService) {}
}
