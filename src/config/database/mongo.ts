// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { DATABASE_ENUM } from './enum';

export const mongoConfig: string = `mongodb://${process.env.MONGODB_DATABASE_USER}:${
  process.env.MONGODB_DATABASE_PASSWORD
}@${process.env.MONGODB_DATABASE_HOST}:${
  process.env.MONGODB_DATABASE_PORT || 27017
}/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1`;

// export const mongoConfig: TypeOrmModuleOptions = {
//     type: 'mongodb',
//     name: DATABASE_ENUM.MONGO_MASTER,
//     url: `mongodb://${process.env.MONGODB_DATABASE_USER}:${
//         process.env.MONGODB_DATABASE_PASSWORD
//       }@${process.env.MONGODB_DATABASE_HOST}:${
//         process.env.MONGODB_DATABASE_PORT || 27017
//       }/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1`,
//     database: 'alex_test',
//     // entities: [__dirname + '/**/*.entity{.ts,.js}'],
//     entities: [],
//     ssl: false,
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// }

// import { Logger } from '@nestjs/common'
// // Logger
// const logger = new Logger('DATABASE PROVIDER')

// .then((connection) => {
//     logger.debug('¡🟢 connexion con Mongodb realizada con éxito!')
//     return connection
//   })
//   .catch((error) => {
//     logger.error('🔴 error al conectar con Mongodb', error)
//   })
