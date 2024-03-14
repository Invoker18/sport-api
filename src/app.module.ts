import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './common/shared.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.prod.env', '.test.env', '.env'], // Cargamos los ficheros de .env
    }), 
    DatabaseModule,
    ResourcesModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
