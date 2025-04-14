import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  
  app.setGlobalPrefix('api');
  
  await app.listen(port);
  Logger.log(`Aplicação iniciada na porta ${port} em modo ${nodeEnv}`, 'Bootstrap');
}

bootstrap();