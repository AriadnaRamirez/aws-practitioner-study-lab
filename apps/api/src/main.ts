import './load-env';
import { ValidationPipe } from '@nestjs/common';
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(API_PREFIX);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(
      [
        'API pública versionada `/api/v1`.',
        'Auth: JWT access Bearer (APS-4).',
        'Content stubs in-memory (APS-6): topics, knowledge, exam questions.',
        'Study sessions (APS-9): EXAM_STUDY on ExamQuestion bank with miss-repeat.',
        'Admin content mutations still use header `x-admin-token` until JWT AdminGuard merge.',
      ].join(' '),
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('health', 'Liveness')
    .addTag('auth', 'Register / login / me')
    .addTag('topics', 'Public topic list')
    .addTag('knowledge', 'Public published KnowledgeItems (flash)')
    .addTag('exam-questions', 'Public published ExamQuestions')
    .addTag('study', 'Study sessions (EXAM_STUDY)')
    .addTag('admin-topics', 'Admin CRUD topics (x-admin-token)')
    .addTag('admin-knowledge', 'Admin CRUD knowledge items')
    .addTag('admin-exam-questions', 'Admin CRUD exam questions')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-admin-token',
        description: 'Placeholder admin secret for content CRUD (APS-6)',
      },
      'admin-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 43124);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(
    `${APP_NAME} API listening on http://127.0.0.1:${port}/${API_PREFIX}`,
  );
  // eslint-disable-next-line no-console
  console.log(`Swagger UI: http://127.0.0.1:${port}/docs`);
}

void bootstrap();
