import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config/config-options';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './helpers/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { Redis } from './config/config-redis';
@Module({
  imports: [
    configOptions,
    AuthModule,
    ResourcesModule,
    SharedModule,
    Redis,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 2,
      },
    ]),
  ],
  controllers: [],
  providers: [
    ConfigModule,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
