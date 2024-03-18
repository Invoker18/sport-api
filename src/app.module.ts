import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { ResourcesModule } from './resources/resources.module';
import { SharedModule } from './common/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.prod.env', '.test.env', '.env'], // Cargamos los ficheros de .env
    }), 
    
                // Inyectamos TypeOrme
                // TypeOrmModule.forRoot(
                //   {
                //   type: 'mssql',
                //   host: process.env.MSSQL_DATABASE_HOST,
                //   port: Number(process.env.MSSQL_DATABASE_PORT) || 1433,
                //   username: process.env.MSSQL_DATABASE_USER,
                //   password: process.env.MSSQL_DATABASE_PASSWORD,
                //   database: process.env.MSSQL_DATABASE_NAME,
                //   requestTimeout: 5000,
                //   options: {
                //     encrypt: false, // Disable SSL/TLS
                //   },
                //   entities: [`${__dirname}/**/*.entity{.ts,.js}`], // se cargan todas las entidades de la base de datos
                //   synchronize: false, //process.env.NODE_ENV === 'development', // Sincronizar la base de datos si estamos en entorno de desarrollo
                //   logging: process.env.NODE_ENV === 'development' ? 'all' : false, // si esta en modo desarrollo, se muestra los logs
                // }
                // ),
    DatabaseModule,
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
