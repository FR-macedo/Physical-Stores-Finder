import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoreController } from './store.controller';
import { StoreService } from '../services/store.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { StoreValidationException, StoreGeocodingException } from '../exceptions/store.exception';

describe('StoreController', () => {
  let controller: StoreController;
  let service: StoreService;

  const mockStoreService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findNearby: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: mockStoreService,
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a store successfully', async () => {
      const createStoreDto: CreateStoreDto = {
        storeName: 'Loja Teste',
        postalCode: '01234-567',
        address1: 'Rua Teste',
        address2: '',
        address3: '',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        emailAddress: 'teste@loja.com',
        telephoneNumber: '(11) 3456-7890',
        takeOutInStore: true,
        shippingTimeInDays: 3,
        type: 'LOJA',
        location: {
          type: 'Point',
          coordinates: [-46.633308, -23.550520]
        }
      };

      const mockStore = { ...createStoreDto, _id: '123' };
      mockStoreService.create.mockResolvedValue(mockStore);

      const result = await controller.create(createStoreDto);

      expect(result).toEqual(mockStore);
      expect(mockStoreService.create).toHaveBeenCalledWith(createStoreDto);
    });

    it('should throw error when store name already exists', async () => {
      const createStoreDto: CreateStoreDto = {
        storeName: 'Loja Teste',
        postalCode: '01234-567',
        address1: 'Rua Teste',
        address2: '',
        address3: '',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        emailAddress: 'teste@loja.com',
        telephoneNumber: '(11) 3456-7890',
        takeOutInStore: true,
        shippingTimeInDays: 3,
        type: 'LOJA',
        location: {
          type: 'Point',
          coordinates: [-46.633308, -23.550520]
        }
      };

      mockStoreService.create.mockRejectedValue(new StoreValidationException('Nome da loja já existe'));

      await expect(controller.create(createStoreDto)).rejects.toThrow(StoreValidationException);
    });
  });

  describe('findAll', () => {
    it('should return all stores', async () => {
      const mockStores = [
        { _id: '1', storeName: 'Loja 1' },
        { _id: '2', storeName: 'Loja 2' },
      ];

      mockStoreService.findAll.mockResolvedValue(mockStores);

      const result = await controller.findAll();

      expect(result).toEqual(mockStores);
      expect(mockStoreService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a store by id', async () => {
      const mockStore = { _id: '123', storeName: 'Loja Teste' };

      mockStoreService.findOne.mockResolvedValue(mockStore);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockStore);
      expect(mockStoreService.findOne).toHaveBeenCalledWith('123');
    });

    it('should throw error when store not found', async () => {
      mockStoreService.findOne.mockRejectedValue(new StoreValidationException('Loja não encontrada'));

      await expect(controller.findOne('123')).rejects.toThrow(StoreValidationException);
    });
  });

  describe('findNearby', () => {
    it('should return nearby stores', async () => {
      const postalCode = '01234-567';
      const mockStores = [{
        storeID: '67fa8b5112267c34e0743a7b',
        storeName: 'Loja Teste',
        address1: 'Rua Teste',
        address2: '',
        address3: '',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234-567',
        district: 'Centro',
        country: 'Brasil',
        telephoneNumber: '(11) 1234-5678',
        emailAddress: 'teste@loja.com',
        type: 'LOJA',
        takeOutInStore: true,
        shippingTimeInDays: 1,
        location: {
          type: 'Point',
          coordinates: [-46.633308, -23.55052]
        }
      }];

      mockStoreService.findNearby.mockResolvedValue(mockStores);

      const result = await controller.findNearby(postalCode);

      expect(result).toEqual(mockStores);
      expect(mockStoreService.findNearby).toHaveBeenCalledWith(postalCode);
    });

    it('should throw error when postal code is invalid', async () => {
      const postalCode = 'invalid';
      mockStoreService.findNearby.mockRejectedValue(new StoreValidationException('CEP inválido'));

      await expect(controller.findNearby(postalCode)).rejects.toThrow(StoreValidationException);
    });

    it('should throw error when geocoding fails', async () => {
      const postalCode = '01234-567';
      mockStoreService.findNearby.mockRejectedValue(new StoreGeocodingException('Erro ao geocodificar endereço'));

      await expect(controller.findNearby(postalCode)).rejects.toThrow(StoreGeocodingException);
    });
  });
}); 