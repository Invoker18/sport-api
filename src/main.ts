import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
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

  // -- Validation  -- Configuramos el uso de validaciones de pipes de manera global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  console.log(`🚀 Servidor iniciado en puerto: ${port}`);
}
bootstrap();
