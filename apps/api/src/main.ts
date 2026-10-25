import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX, APP_NAME } from '@aps/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const webOrigin = process.env.WEB_ORIGIN ?? 'http://127.0.0.1:43123';
  app.enableCors({
    origin: webOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  app.setGlobalPrefix(API_PREFIX);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription('API pública versionada (scaffold — sin features de estudio aún)')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 43124);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`${APP_NAME} API listening on http://127.0.0.1:${port}/${API_PREFIX}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger UI: http://127.0.0.1:${port}/docs`);
}

void bootstrap();
