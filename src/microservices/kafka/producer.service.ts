import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    clientId: 'myapp',
    brokers: ['192.168.5.32:9092'],
  });
  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    console.log('producer.connect');
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    console.log(record);
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
