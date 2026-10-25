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
    .setDescription(
      [
        'API pública versionada `/api/v1`.',
        'APS-6: content stubs in-memory (topics, knowledge, exam questions).',
        'Admin mutations require header `x-admin-token` (= env `ADMIN_TOKEN`).',
        'TODO(APS-4): replace AdminGuard with JWT + role ADMIN.',
      ].join(' '),
    )
    .setVersion('0.1.0')
    .addTag('health', 'Liveness')
    .addTag('topics', 'Public topic list')
    .addTag('knowledge', 'Public published KnowledgeItems (flash)')
    .addTag('exam-questions', 'Public published ExamQuestions')
    .addTag('admin-topics', 'Admin CRUD topics (x-admin-token)')
    .addTag('admin-knowledge', 'Admin CRUD knowledge items')
    .addTag('admin-exam-questions', 'Admin CRUD exam questions')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-admin-token',
        description: 'Placeholder admin secret until APS-4 JWT',
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
