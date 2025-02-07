import { Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { MongooseModule } from '@nestjs/mongoose';
import { configLoader } from './config-loader';

// Logger
const logger = new Logger('DATABASE');
const config = configLoader();

// Constantes que encapsula la conexión a la base de datos
export const DGSDataSource = TypeOrmModule.forRootAsync(config.dgs.db);

// export const MongoDataSource = MongooseModule.forRoot(config.mongo.uri);
