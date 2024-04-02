import { mongoConfig } from './database/mongo';
import { dgsConfig } from './database/mssql';
import { apiKeyConstants } from '../config/const/auth';

export const configLoader = () => {
  return {
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
    prefix_version: process.env.API_PREFIX,
    user: process.env.API_USER,
    pass: process.env.API_PASS,
    port: process.env.API_PORT,
    api_key: apiKeyConstants,
    environment: process.env.NODE_ENV,
    mongo: {
      uri: mongoConfig(),
    },
    dgs: {
      db: dgsConfig(),
      proxy_url: process.env.DGS_PROXY_URL,
      proxy2_url: process.env.DGS_PROXY2_URL,
    },
    redis: {
      url: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
    },
  };
};
