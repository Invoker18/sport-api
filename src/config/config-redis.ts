import { configLoader } from './config-loader';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

const config = configLoader();

// Constantes que encapsula la conexión a la base de datos
export const Redis = CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => ({
    store: await redisStore({
      ttl: 5000,
      socket: {
        host: config.redis.url,
        port: +config.redis.port,
      },
    }),
  }),
});
