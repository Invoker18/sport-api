import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config/config-options';
import { DatabaseModule } from './config/database/database.module';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './helpers/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    configOptions,
    AuthModule,
    DatabaseModule,
    ResourcesModule,
    SharedModule,
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
