import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpShoemakerService {
  constructor(private readonly httpService: HttpService) {}
}
