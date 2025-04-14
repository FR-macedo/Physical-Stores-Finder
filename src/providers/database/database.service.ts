import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.logger.log('Conexão com o banco de dados estabelecida com sucesso');
  }

  onModuleDestroy() {
    this.logger.log('Fechando conexão com o banco de dados');
  }

  async checkHealth(): Promise<boolean> {
    try {
      if (this.connection.readyState === 1) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('Erro ao verificar a saúde do banco de dados:', error);
      return false;
    }
  }
}