import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1', {
    exclude: [
      'health', 'health/live', 'health/ready',
      'sitemap.xml', 'robots.txt', 'feed.xml',
      'json-ld/person', 'json-ld/website', 'json-ld/breadcrumb',
      'json-ld/blog/:slug', 'json-ld/project/:slug',
    ],
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ahmed OS API')
    .setDescription('Personal Developer Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 4000;
  await app.listen(port);
  Logger.log(`🚀 Ahmed OS API running on http://localhost:${port}/api/v1`);
  Logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
