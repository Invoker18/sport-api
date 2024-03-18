import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './common/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { mongoConfig } from './config/database/mongo';
import { DgsConfig } from './config/database/mssql';

console.log(DgsConfig)
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'], // Cargamos los ficheros de .env
      isGlobal: true,
    }), 

    // // Inyectamos TypeOrme
    TypeOrmModule.forRoot(DgsConfig),
    TypeOrmModule.forRoot(mongoConfig),
    ResourcesModule,
    SharedModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 2
      }
    ])
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
