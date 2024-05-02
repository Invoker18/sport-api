import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Message } from 'kafkajs';
import { ConsumerService } from './microservices/kafka/consumer.service';
import { SocketsCenter } from './websockets/sockets-center.service';

@Injectable()
export class OddsConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['odds.DGSDATA.dbo.GAMEVALUES'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          SocketsCenter.broadcast(message.value.toString());
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }


}
