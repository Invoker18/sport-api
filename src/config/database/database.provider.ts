import { Logger } from '@nestjs/common'
import { DataSource } from 'typeorm' // Importante
import * as mongoose from 'mongoose'
// import { testEntity } from '../api/test/entities/test.entity'

/**
 * Proveedor encargado de la conexión con la base de datos
 * Se usa para poder luego inyectarlos, es decir, para poder usarlos en otros módulos
 * es un array de providers
 */

// Logger
const logger = new Logger('DATABASE PROVIDER')

// Constante que encapsula la conexión a la base de datos
export const databaseProviders = [
  {
    provide: 'MSSQL_CONNECTION', // Nombre con el que se inyectará la conexión
    // Inyectamos la conexión a la base de datos y conectamos
    useFactory: () =>
      new DataSource({
        type: 'mssql',
        host: process.env.MSSQL_DATABASE_HOST,
        port: Number(process.env.MSSQL_DATABASE_PORT) || 1433,
        username: process.env.MSSQL_DATABASE_USER,
        password: process.env.MSSQL_DATABASE_PASSWORD,
        database: process.env.MSSQL_DATABASE_NAME,
        requestTimeout: 5000,
        options: {
          encrypt: false, // Disable SSL/TLS
        },
        entities: [`${__dirname}/**/*.entity{.ts,.js}`], // se cargan todas las entidades de la base de datos
        synchronize: false, //process.env.NODE_ENV === 'development', // Sincronizar la base de datos si estamos en entorno de desarrollo
        logging: process.env.NODE_ENV === 'development' ? 'all' : false, // si esta en modo desarrollo, se muestra los logs
      })
        .initialize()
        .then((connection) => {
          logger.debug('¡🟢 connexion con MsSQL realizada con éxito!')
          return connection
        })
        .catch((error) => {
          logger.error('🔴 error al conectar con MsSQL', error)
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
          logger.debug('¡🟢 connexion con Mongodb realizada con éxito!')
          return connection
        })
        .catch((error) => {
          logger.error('🔴 error al conectar con Mongodb', error)
        }),
  },
]