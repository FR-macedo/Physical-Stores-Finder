import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Nível completo para desenvolvimento
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const nodeEnv = configService.get<string>('nodeEnv');

  if (nodeEnv === 'production') {
    app.useLogger(['error', 'warn', 'log']); // Omite debug e verbose
  }

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Lança erro se propriedades não decoradas forem enviadas
      transform: true, // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true, // Permite conversão implícita de tipos
      },
    }),
  );

  // Filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Lojas e Cálculo de Frete')
    .setDescription(
      'API para gerenciamento de lojas físicas e cálculo de fretes by FR-Macedo (durante o estágio na COMPASS)',
    )
    .setVersion('2.0')
    .addTag('stores', 'Endpoints relacionados a lojas físicas')
    .addBearerAuth()
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Adiciona exemplos de respostas de erro
  document.paths = Object.entries(document.paths).reduce(
    (acc, [path, methods]) => {
      acc[path] = Object.entries(methods).reduce(
        (methodAcc, [method, operation]) => {
          methodAcc[method] = {
            ...operation,
            responses: {
              ...operation.responses,
              '400': {
                description: 'Erro de validação',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        statusCode: { type: 'number', example: 400 },
                        code: {
                          type: 'string',
                          example: 'STORE_VALIDATION_ERROR',
                        },
                        message: { type: 'string', example: 'CEP inválido' },
                        details: { type: 'object', example: { cep: '12345' } },
                        timestamp: {
                          type: 'string',
                          example: '2024-04-14T12:00:00.000Z',
                        },
                        path: { type: 'string', example: '/api/stores/nearby' },
                      },
                    },
                  },
                },
              },
              '404': {
                description: 'Recurso não encontrado',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        statusCode: { type: 'number', example: 404 },
                        code: { type: 'string', example: 'STORE_NOT_FOUND' },
                        message: {
                          type: 'string',
                          example: 'Loja não encontrada',
                        },
                        details: { type: 'object', example: { id: '123' } },
                        timestamp: {
                          type: 'string',
                          example: '2024-04-14T12:00:00.000Z',
                        },
                        path: { type: 'string', example: '/api/stores/123' },
                      },
                    },
                  },
                },
              },
              '409': {
                description: 'Conflito',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        statusCode: { type: 'number', example: 409 },
                        code: { type: 'string', example: 'STORE_DUPLICATE' },
                        message: {
                          type: 'string',
                          example: 'Já existe uma loja com este nome',
                        },
                        details: {
                          type: 'object',
                          example: { storeName: 'Loja Teste' },
                        },
                        timestamp: {
                          type: 'string',
                          example: '2024-04-14T12:00:00.000Z',
                        },
                        path: { type: 'string', example: '/api/stores' },
                      },
                    },
                  },
                },
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        statusCode: { type: 'number', example: 500 },
                        code: {
                          type: 'string',
                          example: 'INTERNAL_SERVER_ERROR',
                        },
                        message: {
                          type: 'string',
                          example: 'Erro interno do servidor',
                        },
                        details: {
                          type: 'object',
                          example: { error: 'Database connection failed' },
                        },
                        timestamp: {
                          type: 'string',
                          example: '2024-04-14T12:00:00.000Z',
                        },
                        path: { type: 'string', example: '/api/stores' },
                      },
                    },
                  },
                },
              },
            },
          };
          return methodAcc;
        },
        {},
      );
      return acc;
    },
    {},
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(
    `Aplicação iniciada na porta ${port} em modo ${nodeEnv}`,
    'Bootstrap',
  );
  Logger.log(
    `Documentação Swagger disponível em http://localhost:${port}/docs`,
    'Bootstrap',
  );
}

bootstrap();
