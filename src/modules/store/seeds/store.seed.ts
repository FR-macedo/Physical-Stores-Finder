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
      this.logger.log('Ambiente de desenvolvimento detectado. Iniciando processo de seed...');
      await this.seed();
    } else {
      this.logger.debug('Seed não executado: ambiente não é de desenvolvimento');
    }
  }

  async seed() {
    const startTime = Date.now();
    try {
      this.logger.log('🚀 Iniciando processo de seed de lojas...');
      
      // Verificar se já existem lojas
      const existingStores = await this.storeModel.countDocuments();
      if (existingStores > 0) {
        this.logger.warn(`⚠️ Encontradas ${existingStores} lojas existentes. Removendo...`);
        await this.storeModel.deleteMany({});
        this.logger.log('✅ Lojas existentes removidas com sucesso');
      } else {
        this.logger.log('ℹ️ Nenhuma loja existente encontrada');
      }

      // Lojas originais que serão mantidas
      const originalStores = [
        {
          storeName: "Loja Centro São Paulo",
          postalCode: "01310-100",
          address1: "Avenida Paulista",
          address2: "1000",
          address3: "",
          district: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(11) 4321-1234",
          emailAddress: "sp.centro@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-46.6333, -23.5505], // [longitude, latitude]
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Recife I",
          postalCode: "50870-005",
          address1: "Avenida José Rufino",
          address2: "1407",
          address3: "",
          district: "Areias",
          city: "Recife",
          state: "PE",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(81) 3333-4444",
          emailAddress: "recife.areias@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-34.9355, -8.0913], // [longitude, latitude]
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Limoeiro I",
          postalCode: "55700-000",
          address1: "PE-050",
          address2: "S/N",
          address3: "",
          district: "Centro",
          city: "Limoeiro",
          state: "PE",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(81) 3628-1234",
          emailAddress: "limoeiro@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          location: {
            type: "Point",
            coordinates: [-35.4281, -7.8983], // [longitude, latitude]
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Caruaru I",
          postalCode: "55002-970",
          address1: "Rua Ypiraflor",
          address2: "S/N",
          address3: "",
          district: "Cortume",
          city: "Caruaru",
          state: "PE",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(81) 3721-9876",
          emailAddress: "caruaru@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-36.0292, -8.1973], // [longitude, latitude]
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

      // Novas lojas - uma para cada estado brasileiro
      const newStores = [
        // Região Norte
        {
          storeName: "Loja Manaus Centro",
          postalCode: "69020-110",
          address1: "Avenida Eduardo Ribeiro",
          address2: "520",
          address3: "",
          district: "Centro",
          city: "Manaus",
          state: "AM",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(92) 3232-5566",
          emailAddress: "manaus.centro@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          location: {
            type: "Point",
            coordinates: [-60.0261, -3.1190], // Manaus
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Belém Shopping",
          postalCode: "66055-200",
          address1: "Avenida Doca de Souza Franco",
          address2: "1593",
          address3: "Piso L3",
          district: "Umarizal",
          city: "Belém",
          state: "PA",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(91) 3344-7788",
          emailAddress: "belem.shopping@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-48.4902, -1.4558], // Belém
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Macapá",
          postalCode: "68900-074",
          address1: "Avenida FAB",
          address2: "1234",
          address3: "",
          district: "Central",
          city: "Macapá",
          state: "AP",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(96) 3223-4455",
          emailAddress: "macapa@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 4,
          location: {
            type: "Point",
            coordinates: [-51.0667, 0.0356], // Macapá
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Boa Vista",
          postalCode: "69301-380",
          address1: "Avenida Jaime Brasil",
          address2: "223",
          address3: "",
          district: "Centro",
          city: "Boa Vista",
          state: "RR",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(95) 3224-5566",
          emailAddress: "boavista@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 5,
          location: {
            type: "Point",
            coordinates: [-60.6758, 2.8198], // Boa Vista
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Porto Velho",
          postalCode: "76801-060",
          address1: "Avenida Sete de Setembro",
          address2: "1045",
          address3: "",
          district: "Centro",
          city: "Porto Velho",
          state: "RO",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(69) 3225-6677",
          emailAddress: "portovelho@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 4,
          location: {
            type: "Point",
            coordinates: [-63.9004, -8.7619], // Porto Velho
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Palmas Centro",
          postalCode: "77015-012",
          address1: "Avenida JK",
          address2: "104 Norte",
          address3: "",
          district: "Plano Diretor Norte",
          city: "Palmas",
          state: "TO",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(63) 3227-7890",
          emailAddress: "palmas@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          location: {
            type: "Point",
            coordinates: [-48.3242, -10.1689], // Palmas
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Rio Branco",
          postalCode: "69900-078",
          address1: "Rua Epaminondas Jácome",
          address2: "2318",
          address3: "",
          district: "Centro",
          city: "Rio Branco",
          state: "AC",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(68) 3223-8899",
          emailAddress: "riobranco@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 5,
          location: {
            type: "Point",
            coordinates: [-67.8076, -9.9781], // Rio Branco
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Região Nordeste (já temos algumas de PE)
        {
          storeName: "Loja Salvador Shopping",
          postalCode: "41730-101",
          address1: "Avenida Tancredo Neves",
          address2: "2915",
          address3: "Piso L3",
          district: "Caminho das Árvores", 
          city: "Salvador",
          state: "BA",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(71) 3333-6677",
          emailAddress: "salvador.shopping@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-38.4812, -12.9714], // Salvador
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Fortaleza",
          postalCode: "60175-055",
          address1: "Avenida Monsenhor Tabosa",
          address2: "1234",
          address3: "",
          district: "Meireles",
          city: "Fortaleza",
          state: "CE",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(85) 3232-7788",
          emailAddress: "fortaleza@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-38.5266, -3.7319], // Fortaleza
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja São Luís",
          postalCode: "65015-900",
          address1: "Rua Grande",
          address2: "782",
          address3: "",
          district: "Centro",
          city: "São Luís",
          state: "MA",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(98) 3222-5566",
          emailAddress: "saoluis@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          location: {
            type: "Point",
            coordinates: [-44.3028, -2.5307], // São Luís
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja João Pessoa",
          postalCode: "58013-480",
          address1: "Avenida Presidente Epitácio Pessoa",
          address2: "1000",
          address3: "",
          district: "Expedicionários",
          city: "João Pessoa",
          state: "PB",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(83) 3244-7788",
          emailAddress: "joaopessoa@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-34.8813, -7.1195], // João Pessoa
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Teresina",
          postalCode: "64001-280",
          address1: "Rua Álvaro Mendes",
          address2: "1430",
          address3: "",
          district: "Centro",
          city: "Teresina",
          state: "PI",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(86) 3221-7788",
          emailAddress: "teresina@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          location: {
            type: "Point",
            coordinates: [-42.8019, -5.0892], // Teresina
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Natal Shopping",
          postalCode: "59051-500",
          address1: "Avenida Senador Salgado Filho",
          address2: "2233",
          address3: "Piso L2",
          district: "Candelária",
          city: "Natal",
          state: "RN",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(84) 3232-9900",
          emailAddress: "natal.shopping@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-35.2094, -5.7793], // Natal
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Aracaju",
          postalCode: "49015-510",
          address1: "Avenida Barão de Maruim",
          address2: "245",
          address3: "",
          district: "Centro",
          city: "Aracaju",
          state: "SE",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(79) 3211-4422",
          emailAddress: "aracaju@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-37.0731, -10.9472], // Aracaju
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Região Centro-Oeste
        {
          storeName: "Loja Brasília Shopping",
          postalCode: "70710-904",
          address1: "SCN Quadra 5 Bloco A",
          address2: "Loja 34",
          address3: "Piso L3",
          district: "Asa Norte",
          city: "Brasília",
          state: "DF",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(61) 3333-5566",
          emailAddress: "brasilia.shopping@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-47.8825, -15.7942], // Brasília
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Goiânia",
          postalCode: "74115-010",
          address1: "Avenida 85",
          address2: "1250",
          address3: "",
          district: "Setor Bueno",
          city: "Goiânia",
          state: "GO",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(62) 3245-7788",
          emailAddress: "goiania@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-49.2534, -16.6864], // Goiânia
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Cuiabá",
          postalCode: "78005-370",
          address1: "Avenida Isaac Póvoas",
          address2: "1232",
          address3: "",
          district: "Centro Norte",
          city: "Cuiabá",
          state: "MT",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(65) 3321-7788",
          emailAddress: "cuiaba@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 3,
          location: {
            type: "Point",
            coordinates: [-56.0974, -15.5989], // Cuiabá
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Campo Grande",
          postalCode: "79002-075",
          address1: "Rua 14 de Julho",
          address2: "909",
          address3: "",
          district: "Centro",
          city: "Campo Grande",
          state: "MS",
          type: "PDV",
          country: "Brasil",
          telephoneNumber: "(67) 3321-7890",
          emailAddress: "campogrande@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-54.6462, -20.4486], // Campo Grande
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Região Sudeste (já temos SP)
        {
          storeName: "Loja Rio de Janeiro - Copacabana",
          postalCode: "22060-002",
          address1: "Avenida Nossa Senhora de Copacabana",
          address2: "945",
          address3: "",
          district: "Copacabana",
          city: "Rio de Janeiro",
          state: "RJ",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(21) 3322-5566",
          emailAddress: "rio.copacabana@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-43.1780, -22.9699], // Rio de Janeiro - Copacabana
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Belo Horizonte",
          postalCode: "30130-170",
          address1: "Avenida Afonso Pena",
          address2: "2700",
          address3: "",
          district: "Funcionários",
          city: "Belo Horizonte",
          state: "MG",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(31) 3344-5566",
          emailAddress: "bh@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-43.9298, -19.9191], // Belo Horizonte
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Vitória",
          postalCode: "29050-902",
          address1: "Avenida Nossa Senhora da Penha",
          address2: "2150",
          address3: "Loja 25",
          district: "Santa Luíza",
          city: "Vitória",
          state: "ES",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(27) 3345-7788",
          emailAddress: "vitoria@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-40.2980, -20.2976], // Vitória
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Região Sul
        {
          storeName: "Loja Curitiba",
          postalCode: "80240-210",
          address1: "Avenida Sete de Setembro",
          address2: "3293",
          address3: "",
          district: "Centro",
          city: "Curitiba",
          state: "PR",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(41) 3334-5566",
          emailAddress: "curitiba@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-49.2715, -25.4290], // Curitiba
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Florianópolis",
          postalCode: "88015-905",
          address1: "Rua Felipe Schmidt",
          address2: "774",
          address3: "",
          district: "Centro",
          city: "Florianópolis",
          state: "SC",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(48) 3324-7788",
          emailAddress: "floripa@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 2,
          location: {
            type: "Point",
            coordinates: [-48.5482, -27.5973], // Florianópolis
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storeName: "Loja Porto Alegre",
          postalCode: "90110-150",
          address1: "Avenida Praia de Belas",
          address2: "1181",
          address3: "Loja 3042",
          district: "Praia de Belas",
          city: "Porto Alegre",
          state: "RS",
          type: "LOJA",
          country: "Brasil",
          telephoneNumber: "(51) 3322-7788",
          emailAddress: "poa@minhaloja.com",
          takeOutInStore: true,
          shippingTimeInDays: 1,
          location: {
            type: "Point",
            coordinates: [-51.2177, -30.0368], // Porto Alegre
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

      // Combinando as lojas originais com as novas
      const allStores = [...originalStores, ...newStores];
      
      // Inserir todas as lojas
      this.logger.log(`📝 Inserindo ${allStores.length} lojas (${originalStores.length} originais + ${newStores.length} novas)...`);
      const insertedStores = await this.storeModel.insertMany(allStores);
      
      // Agrupando lojas por região para melhor visualização no log
      const storesByRegion = {
        Norte: insertedStores.filter(store => ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'].includes(store.state)),
        Nordeste: insertedStores.filter(store => ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'].includes(store.state)),
        CentroOeste: insertedStores.filter(store => ['DF', 'GO', 'MT', 'MS'].includes(store.state)),
        Sudeste: insertedStores.filter(store => ['ES', 'MG', 'RJ', 'SP'].includes(store.state)),
        Sul: insertedStores.filter(store => ['PR', 'RS', 'SC'].includes(store.state))
      };
      
      // Log detalhado das lojas inseridas por região
      this.logger.log('📊 Resumo das lojas inseridas por região:');
      
      Object.keys(storesByRegion).forEach(region => {
        this.logger.log(`\n🔹 Região ${region} (${storesByRegion[region].length} lojas):`);
        storesByRegion[region].forEach(store => {
          this.logger.log(`  • ${store.storeName} (${store.type}) - ${store.city}/${store.state}`);
        });
      });
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      this.logger.log(`\n✅ Seed concluído com sucesso!`);
      this.logger.log(`⏱️  Tempo total: ${duration.toFixed(2)} segundos`);
      this.logger.log(`📈 Total de lojas: ${insertedStores.length}`);
      this.logger.log(`📊 Cobertura: ${new Set(insertedStores.map(store => store.state)).size} estados brasileiros`);
    } catch (error) {
      this.logger.error('❌ Erro durante o processo de seed:', error.stack);
      throw error; // Propaga o erro para que a aplicação saiba que houve falha
    }
  }
}