import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { DATABASE_ENUM } from './enum';

export const dgsConfig = (): TypeOrmModuleAsyncOptions => {
  return {
    name: DATABASE_ENUM.MSSQL_DGS,
    useFactory: () => ({
      type: 'mssql',
      host: process.env.MSSQL_DATABASE_HOST_DGS,
      port: Number(process.env.MSSQL_DATABASE_PORT_DGS) || 1433,
      username: process.env.MSSQL_DATABASE_USER_DGS,
      password: process.env.MSSQL_DATABASE_PASSWORD_DGS,
      database: process.env.MSSQL_DATABASE_NAME_DGS,
      requestTimeout: 5000,
      options: {
        encrypt: false, // Disable SSL/TLS
      },
      entities: [],
      // entities: [`${__dirname}/**/*.entity{.ts,.js}`], // se cargan todas las entidades de la base de datos
      synchronize: false, //process.env.NODE_ENV === 'development', // Sincronizar la base de datos si estamos en entorno de desarrollo
      logging: process.env.NODE_ENV === 'development' ? 'all' : false, // si esta en modo desarrollo, se muestra los logs
    }),
  };
};
