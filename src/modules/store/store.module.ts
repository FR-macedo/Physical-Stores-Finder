import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store, StoreSchema } from './entities/store.entity';
import { StoreSeed } from './seeds/store.seed';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema }
    ]),
  ],
  controllers: [StoreController],
  providers: [StoreService, StoreSeed],
})
export class StoreModule {}