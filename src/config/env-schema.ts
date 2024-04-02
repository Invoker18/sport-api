import * as Joi from 'joi';

export const envSchema = Joi.object({
  API_PORT: Joi.string().default(3000),
  NODE_ENV: Joi.string().default('development'),
  MONGODB_DATABASE_USER: Joi.string().required(),
  MONGODB_DATABASE_PASSWORD: Joi.string().required(),
  MONGODB_DATABASE_HOST: Joi.string().required(),
  MONGODB_DATABASE_PORT: Joi.string().required(),
});
