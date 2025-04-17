import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';
import { Store, StoreSchema } from './schemas/store.schema';
import { ExternalModule } from '../external/external.module';
import { StoreSeed } from './seeds/store.seed';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    ConfigModule,
    ExternalModule,
  ],
  controllers: [StoreController],
  providers: [StoreSeed ,StoreService],
  exports: [StoreService],
})
export class StoreModule {}