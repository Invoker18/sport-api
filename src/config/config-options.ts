import { ConfigModule } from '@nestjs/config';
import { configLoader } from './config-loader';
import { envSchema } from './env-schema';

export const configOptions = ConfigModule.forRoot({
  load: [configLoader],
  validationSchema: envSchema,
  envFilePath: ['.prod.env', '.test.env', '.env'], // Cargamos los ficheros de .env
  isGlobal: true,
  cache: true,
});
