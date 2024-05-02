import { Injectable } from '@nestjs/common';
import { ProducerService } from './microservices/kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async getHello() {
    await this.producerService.produce({
      topic: 'odds.DGSDATA.dbo.GAMEVALUES',
      messages: [{ value: 'Hello World' }],
    });
    return 'Hello World!';
  }
}
