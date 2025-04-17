import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DatabaseConnection } from './database.connection';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private readonly databaseConnection: DatabaseConnection,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    const url = this.configService.get<string>('MONGODB_URI');
    
    if (!url) {
      this.logger.error('URL do banco de dados não configurada');
      throw new Error('URL do banco de dados não configurada');
    }

    await this.databaseConnection.connect(url);
    this.logger.log('Conexão com o banco de dados estabelecida com sucesso');
  }

  async disconnect(): Promise<void> {
    await this.databaseConnection.disconnect();
    this.logger.log('Desconectado do banco de dados');
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