import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
const envModule = ConfigModule.forRoot({
  envFilePath: ['.prod.env', '.test.env', '.env'], // Cargamos los ficheros de .env
  isGlobal: true,
});
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './helpers/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './config/database/mongo';
import { DgsConfig } from './config/database/mssql';
import { AuthModule } from './resources/auth/auth.module';

@Module({
  imports: [
    envModule,
    TypeOrmModule.forRoot(DgsConfig),
    MongooseModule.forRoot(mongoConfig),
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
