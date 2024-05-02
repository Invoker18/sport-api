import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProducerService } from './microservices/kafka/producer.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
