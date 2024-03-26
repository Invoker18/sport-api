import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm'; // Importante
import * as mongoose from 'mongoose';
import { configLoader } from '../config-loader';

/**
 * Proveedor encargado de la conexión con la base de datos
 * Se usa para poder luego inyectarlos, es decir, para poder usarlos en otros módulos
 * es un array de providers
 */

// Logger
const logger = new Logger('DATABASE PROVIDER');

// Constante que encapsula la conexión a la base de datos
export const databaseProviders = [
  {
    provide: 'MSSQL_CONNECTION', // Nombre con el que se inyectará la conexión
    // Inyectamos la conexión a la base de datos y conectamos
    useFactory: () =>
      new DataSource({
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
      })
        .initialize()
        .then((connection) => {
          logger.debug('¡🟢 connexion con MsSQL realizada con éxito!');
          return connection;
        })
        .catch((error) => {
          logger.error('🔴 error al conectar con MsSQL', error);
        }),
  },

  // Inyectamos la conexión a la base de datos y conectamos
  {
    provide: 'MONGODB_CONNECTION', // Nombre con el que se inyectará la conexión
    useFactory: () =>
      mongoose
        .connect(
          `mongodb://${process.env.MONGODB_DATABASE_USER}:${
            process.env.MONGODB_DATABASE_PASSWORD
          }@${process.env.MONGODB_DATABASE_HOST}:${
            process.env.MONGODB_DATABASE_PORT || 27017
            // }/${process.env.MONGODB_DATABASE_NAME}`,
          }/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1`,
        )
        .then((connection) => {
          logger.debug('¡🟢 connexion con Mongodb realizada con éxito!');
          return connection;
        })
        .catch((error) => {
          logger.error('🔴 error al conectar con Mongodb', error);
        }),
  },

  // {
  //   provide: 'MYSQL_CONNECTION', // Nombre con el que se inyectará la conexión
  //   // Inyectamos la conexión a la base de datos y conectamos
  //   useFactory: () =>
  //     new DataSource({
  //       type: 'mysql',
  //       host: process.env.MYSQL_DATABASE_HOST,
  //       port: Number(process.env.MYSQL_DATABASE_PORT) || 3306,
  //       username: process.env.MYSQL_DATABASE_USER,
  //       password: process.env.MYSQL_DATABASE_PASSWORD,
  //       database: process.env.MYSQL_DATABASE_NAME,
  //       entities: [`${__dirname}/**/*.entity{.ts,.js}`], // se cargan todas las entidades de la base de datos
  //       // autoLoadEntities: true, // si no se especifica, se carga todas las entidades de la base de datos
  //       synchronize: process.env.NODE_ENV === 'development', // si ha cambia el modelo, se sincroniza con la base de datos
  //       logging: process.env.NODE_ENV === 'development' ? 'all' : false, // si esta en modo desarrollo, se muestra los logs
  //     })
  //       .initialize()
  //       .then((connection) => {
  //         logger.debug('¡🟢 connexion con MYSQL realizada con éxito!')
  //         return connection
  //       })
  //       .catch((error) => {
  //         logger.error('🔴 error al conectar con MYSQL', error)
  //       }),
  // },
];
