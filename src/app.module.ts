import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configOptions } from './config/config-options';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './helpers/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './resources/auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (config: ConfigService) => config.get('dgs.db'),
    //   inject: [ConfigService],
    // }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => config.get('mongo.uri'),
    //   inject: [ConfigService],
    // }),
    AuthModule,
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
