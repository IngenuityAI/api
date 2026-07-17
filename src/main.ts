import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationConfig } from './config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: ApplicationConfig.cors.allowedOrigins,
  });

  await app.listen(ApplicationConfig.http.port);
}
void bootstrap();
