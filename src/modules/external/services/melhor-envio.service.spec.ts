import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { MelhorEnvioService, MelhorEnvioShippingOption } from './melhor-envio.service';
import { MelhorEnvioApiError } from '../exceptions/melhor-envio-api.error';

describe('MelhorEnvioService', () => {
  let service: MelhorEnvioService;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn(),
      axiosRef: {
        defaults: {
          headers: {
            common: {}
          }
        }
      }
    } as any;

    mockConfigService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MelhorEnvioService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MelhorEnvioService>(MelhorEnvioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateShipping', () => {
    const fromPostalCode = '01001-000';
    const toPostalCode = '01310-100';

    const mockShippingResponse: MelhorEnvioShippingOption[] = [
      {
        id: 1,
        name: 'PAC',
        price: 15.90,
        delivery_time: 5,
        delivery_range: {
          min: 3,
          max: 7,
        },
        company: {
          id: 1,
          name: 'Correios',
        },
      },
      {
        id: 2,
        name: 'SEDEX',
        price: 25.90,
        delivery_time: 2,
        delivery_range: {
          min: 1,
          max: 3,
        },
        company: {
          id: 1,
          name: 'Correios',
        },
      },
    ];

    it('should return shipping options successfully', async () => {
      // Mock the configService.get to return a token
      mockConfigService.get.mockReturnValue('fake-token');
      
      // Mock the BaseExternalApiService.post method that's being called inside calculateShipping
      jest.spyOn(service as any, 'post').mockResolvedValue(mockShippingResponse);

      const result = await service.calculateShipping(fromPostalCode, toPostalCode);

      expect(result).toEqual(mockShippingResponse);
      expect(mockConfigService.get).toHaveBeenCalledWith('services.melhorEnvio.token');
    });

    it('should throw error when token is not configured', async () => {
      mockConfigService.get.mockReturnValue(null);

      await expect(service.calculateShipping(fromPostalCode, toPostalCode)).rejects.toThrow(MelhorEnvioApiError);
    });

    it('should throw error when no shipping options are found', async () => {
      mockConfigService.get.mockReturnValue('fake-token');
      jest.spyOn(service as any, 'post').mockResolvedValue([]);

      await expect(service.calculateShipping(fromPostalCode, toPostalCode)).rejects.toThrow(MelhorEnvioApiError);
    });

    it('should throw error when API request fails', async () => {
      mockConfigService.get.mockReturnValue('fake-token');
      jest.spyOn(service as any, 'post').mockRejectedValue(new Error('API Error'));

      await expect(service.calculateShipping(fromPostalCode, toPostalCode)).rejects.toThrow(MelhorEnvioApiError);
    });
  });
});