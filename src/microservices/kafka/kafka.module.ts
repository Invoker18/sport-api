import { Module } from '@nestjs/common';
import { WebSocketModule } from '../../websockets/websocket.module';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';

@Module({
  imports: [WebSocketModule],
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
