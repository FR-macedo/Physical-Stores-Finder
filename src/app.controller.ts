import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './providers/database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async checkHealth() {
    const dbStatus = await this.databaseService.checkHealth();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
      }
    };
  }
}