import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { E_TOO_MANY_REQUESTS } from './config/const/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.API_PORT ? parseInt(process.env.API_PORT) : 3000;
  const config = new DocumentBuilder()
  .setTitle(process.env.APP_NAME)
  .setDescription(process.env.APP_DESCRIPTION)
  .setVersion(process.env.APP_VERSION)
  .addBasicAuth()
  //.addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  const options = {
    customfavIcon: '<path>/favicon.png', //adding our favicon to swagger
    customSiteTitle: 'Sport API Docs', //add site title to swagger for nice SEO
    swaggerOptions: {
      persistAuthorization: true, // this helps to retain the token even after refreshing the (swagger UI web page)
      // swaggerOptions: { defaultModelsExpandDepth: -1 } //uncomment this line to stop seeing the schema on swagger ui
    },
  };

  SwaggerModule.setup('api', app, document, options);

  // Configuramos el prefijo de la API
  //  app.setGlobalPrefix(process.env.API_PREFIX || 'v1')

  // -- Helmet
  app.use(helmet());

  // -- Cors setup
  app.enableCors({
    origin: false, // Specify the allowed origins.  I'm setting false to allow requests from any origin
    // Find more configuration options here: https://github.com/expressjs/cors#configuration-options
  });

  // -- Rate limiting: Limits the number of requests from the same IP in a period of time.
  // -- More at: https://www.npmjs.com/package/express-rate-limit
  app.use(rateLimit({
    windowMs: 10 * 60 * 100, // 1 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    skipSuccessfulRequests: false, // The counting will skip all successful requests and just count the errors. Instead of removing rate-limiting, it's better to set this to true to limit the number of times a request fails. Can help prevent against brute-force attacks
    message: { "message": E_TOO_MANY_REQUESTS, "statusCode": 403, }
  }));

  // -- Validation  -- Configuramos el uso de validaciones de pipes de manera global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  await app.listen(port);
  console.log(`🚀 Servidor iniciado en puerto: ${port}`)
}
bootstrap();
