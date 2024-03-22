import { mongoConfig } from './database/mongo';
import { dgsConfig } from './database/mssql';

export const configLoader = () => {
  return {
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
    port: process.env.API_PORT,
    apiKey: process.env.API_KEY,
    environment: process.env.NODE_ENV,
    mongo: {
      uri: mongoConfig,
    },
    dgs: {
      db: dgsConfig,
    },
  };
};
