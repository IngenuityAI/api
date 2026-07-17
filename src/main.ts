import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationConfig } from './config';
import { INestApplication, VersioningType } from '@nestjs/common';

export let app: INestApplication<any>;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

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
