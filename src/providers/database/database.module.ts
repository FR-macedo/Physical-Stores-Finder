import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseConnection } from './database.connection';

@Module({
  providers: [DatabaseService, DatabaseConnection],
  exports: [DatabaseService], 
})
export class DatabaseModule {}