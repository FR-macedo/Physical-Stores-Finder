import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

@Module({
  imports: [
    // Configuração global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // Configuração do MongoDB usando os valores do configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
    
    // Aqui você adicionaria seus outros módulos
    // StoreModule,
    // ProvidersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  // Configurações de middleware se necessário
  configure(consumer: MiddlewareConsumer) {
    // Adicione middlewares globais aqui se precisar
  }
}