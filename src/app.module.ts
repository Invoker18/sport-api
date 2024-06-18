import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config/config-options';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './helpers/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { Redis } from './config/config-redis';
import { WebSocketModule } from './websockets/websocket.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './microservices/kafka/kafka.module';
import { OddsConsumer } from './odds.consumer';
import { TransformInterceptor } from './interceptor/transform.interceptor';
@Module({
  imports: [
    configOptions,
    AuthModule,
    KafkaModule,
    ResourcesModule,
    SharedModule,
    // WebSocketModule,
    Redis,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 2,
      },
    ]),
  ],
  // controllers: [AppController],
  providers: [
    ConfigModule,
    // AppService,
    OddsConsumer,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
