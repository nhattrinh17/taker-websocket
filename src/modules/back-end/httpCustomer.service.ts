import { HttpService } from '@nestjs/axios';
import { FindShoemakerWithSocketDto } from './dto/request-backend.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpCustomerService {
  constructor(private readonly httpService: HttpService) {}

  async requestFindShoemaker(token: string, dto: FindShoemakerWithSocketDto) {
    try {
      console.log(
        '🚀 ~ HttpCustomerService ~ requestFindShoemaker ~ dto:',
        dto,
      );
      const url = `${process.env.BE_CUSTOMER_URL}/v1/trips/find-shoemakers`;
      return this.httpService.axiosRef.post(url, dto, {
        headers: { Authorization: 'Bearer ' + token },
      });
    } catch (error) {
      console.log(
        '🚀 ~ HttpCustomerService ~ requestFindShoemaker ~ error:',
        error,
      );
      return true;
    }
  }
}
