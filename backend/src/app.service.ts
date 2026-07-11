import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      message: 'ABC School Admission API is running smoothly',
      timestamp: new Date().toISOString(),
    };
  }
}
