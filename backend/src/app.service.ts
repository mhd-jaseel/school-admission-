import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      message: 'ABC Academy API is running successfully 🚀',
      timestamp: new Date().toISOString(),
    };
  }
}
