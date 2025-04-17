import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { GoogleMapsService } from './google-maps.service';
import { GoogleMapsApiError } from '../exceptions/google-maps-api.error';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockHttpService = {
      get: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        GoogleMapsService,
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

    service = module.get<GoogleMapsService>(GoogleMapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoordinatesFromAddress', () => {
    it('should return coordinates for a valid address', async () => {
      const address = 'Rua Teste, 123, São Paulo - SP';
      const mockResponse = {
        results: [
          {
            geometry: {
              location: {
                lat: -23.550520,
                lng: -46.633308,
              },
            },
          },
        ],
        status: 'OK',
      };

      mockConfigService.get.mockReturnValue('fake-api-key');
      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getCoordinatesFromAddress(address);

      expect(result).toEqual({
        lat: -23.550520,
        lng: -46.633308,
      });
    });

    it('should throw error when API key is not configured', async () => {
      mockConfigService.get.mockReturnValue(null);

      await expect(service.getCoordinatesFromAddress('test')).rejects.toThrow(
        GoogleMapsApiError
      );
    });

    it('should throw error when API returns no results', async () => {
      const mockResponse = {
        results: [],
        status: 'ZERO_RESULTS',
      };

      mockConfigService.get.mockReturnValue('fake-api-key');
      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      await expect(service.getCoordinatesFromAddress('test')).rejects.toThrow(
        GoogleMapsApiError
      );
    });

    it('should throw error when API returns error status', async () => {
      const mockResponse = {
        status: 'ERROR',
        error_message: 'Invalid request',
      };

      mockConfigService.get.mockReturnValue('fake-api-key');
      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      await expect(service.getCoordinatesFromAddress('test')).rejects.toThrow(
        GoogleMapsApiError
      );
    });
  });

  describe('calculateDistance', () => {
    it('should return distance between two points', async () => {
      const origin = { type: 'Point', coordinates: [-46.633308, -23.550520] };
      const destination = { type: 'Point', coordinates: [-46.654400, -23.563200] };
      const mockResponse: AxiosResponse = {
        data: {
          routes: [
            {
              legs: [
                {
                  distance: {
                    value: 3000,
                    text: '3.0 km',
                  },
                  duration: {
                    value: 600,
                    text: '10 mins',
                  },
                },
              ],
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockConfigService.get.mockReturnValue('fake-api-key');
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.calculateDistance(origin, destination);

      expect(result).toEqual({
        distance: 3000,
        duration: 600,
      });
    });

    it('should throw an error if the API returns an error', async () => {
      const origin = { type: 'Point', coordinates: [-46.633308, -23.550520] };
      const destination = { type: 'Point', coordinates: [-46.654400, -23.563200] };
      const mockResponse = {
        status: 'ERROR',
        error_message: 'Invalid request',
      };

      mockConfigService.get.mockReturnValue('fake-api-key');
      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      await expect(service.calculateDistance(origin, destination)).rejects.toThrow(
        GoogleMapsApiError,
      );
    });

    it('should throw an error if the API key is not provided', async () => {
      const origin = { type: 'Point', coordinates: [-46.633308, -23.550520] };
      const destination = { type: 'Point', coordinates: [-46.654400, -23.563200] };

      mockConfigService.get.mockReturnValue(null);

      await expect(service.calculateDistance(origin, destination)).rejects.toThrow(
        GoogleMapsApiError,
      );
    });

    it('should throw an error if the API request fails', async () => {
      const origin = { type: 'Point', coordinates: [-46.633308, -23.550520] };
      const destination = { type: 'Point', coordinates: [-46.654400, -23.563200] };

      mockConfigService.get.mockReturnValue('fake-api-key');
      jest.spyOn(service as any, 'get').mockRejectedValue(new Error('Network error'));

      await expect(service.calculateDistance(origin, destination)).rejects.toThrow(
        GoogleMapsApiError,
      );
    });
  });
}); 