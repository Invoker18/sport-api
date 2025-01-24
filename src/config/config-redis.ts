import { configLoader } from './config-loader';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

const config = configLoader();

// Constantes que encapsula la conexión a la base de datos
export const Redis = CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => ({
    store: createKeyv(`redis://${config.redis.host}:${config.redis.port}`, {
      namespace: 'sport_api',
    }),
  }),
});
