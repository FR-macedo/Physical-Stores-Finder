import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configuração global de prefixo para API
  app.setGlobalPrefix('api');
  
  // Adiciona validação global com ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configuração de CORS se necessário
  app.enableCors();
  
  // Obtenha a porta da configuração
  const port = configService.get<number>('port');
  
  await app.listen(port);
  
  const nodeEnv = configService.get<string>('nodeEnv');
  Logger.log(`Aplicação iniciada na porta ${port} em modo ${nodeEnv}`, 'Bootstrap');
}

bootstrap();