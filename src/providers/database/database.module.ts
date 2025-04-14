// providers/database/database.module.ts
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // Isso torna o serviço disponível para outros módulos
})
export class DatabaseModule {}