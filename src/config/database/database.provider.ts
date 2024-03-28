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
const config = configLoader();

// Constante que encapsula la conexión a la base de datos
export const databaseProviders = [
  {
    provide: 'MSSQL_CONNECTION', // Nombre con el que se inyectará la conexión
    // Inyectamos la conexión a la base de datos y conectamos
    useFactory: () =>
      new DataSource(config.dgs.db)
        .initialize()
        .then((connection) => {
          //   console.log(connection);
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
        .connect(config.mongo.uri)
        .then((connection) => {
          logger.debug('¡🟢 connexion con Mongodb realizada con éxito!');
          return connection;
        })
        .catch((error) => {
          logger.error('🔴 error al conectar con Mongodb', error);
        }),
  },
];
