// src/modules/store/seeds/store.seed.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../entities/store.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StoreSeed implements OnModuleInit {
  private readonly logger = new Logger('StoreSeed');
  
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const nodeEnv = this.configService.get<string>('nodeEnv');
    
    // Apenas executar em ambiente de desenvolvimento
    if (nodeEnv === 'development') {
      await this.seed();
    }
  }

  async seed() {
    try {
      this.logger.log('Iniciando seed de lojas...');
      
      // Apagar todas as lojas existentes
      await this.storeModel.deleteMany({});
      this.logger.log('Lojas existentes removidas com sucesso');

      // Dados das lojas para serem inseridas
      const stores = [
        {
          storeName: "Loja Centro São Paulo",
          postalCode: "01310-100",
          address1: "Avenida Paulista",
          number: "1000",
          district: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          type: "LOJA",
          telephoneNumber: "(11) 4321-1234",
          emailAddress: "sp.centro@minhaloja.com",
          location: {
            type: "Point",
            coordinates: [-46.6333, -23.5505], // [longitude, latitude]
          },
        },
        {
          storeName: "Loja Recife I",
          postalCode: "50870-005",
          address1: "Avenida José Rufino",
          number: "1407",
          district: "Areias",
          city: "Recife",
          state: "PE",
          country: "Brasil",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          type: "LOJA",
          telephoneNumber: "(81) 3333-4444",
          emailAddress: "recife.areias@minhaloja.com",
          location: {
            type: "Point",
            coordinates: [-34.9355, -8.0913], // [longitude, latitude]
          },
        },
        {
          storeName: "Loja Limoeiro I",
          postalCode: "55700-000",
          address1: "PE-050",
          number: "S/N",
          district: "Centro",
          city: "Limoeiro",
          state: "PE",
          country: "Brasil",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          type: "PDV",
          telephoneNumber: "(81) 3628-1234",
          emailAddress: "limoeiro@minhaloja.com",
          location: {
            type: "Point",
            coordinates: [-35.4281, -7.8983], // [longitude, latitude]
          },
        },
        {
          storeName: "Loja Caruaru I",
          postalCode: "55002-970",
          address1: "Rua Ypiraflor",
          number: "S/N",
          district: "Cortume",
          city: "Caruaru",
          state: "PE",
          country: "Brasil",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          type: "LOJA",
          telephoneNumber: "(81) 3721-9876",
          emailAddress: "caruaru@minhaloja.com",
          location: {
            type: "Point",
            coordinates: [-36.0292, -8.1973], // [longitude, latitude]
          },
        },
      ];

      // Inserir as novas lojas
      await this.storeModel.insertMany(stores);
      
      this.logger.log(`${stores.length} lojas inseridas com sucesso!`);
    } catch (error) {
      this.logger.error('Erro ao inserir lojas:', error);
    }
  }
}