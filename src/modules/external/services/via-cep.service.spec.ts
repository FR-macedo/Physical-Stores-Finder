import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ViaCepService } from './via-cep.service';
import { ExternalApiResponseException, ExternalApiConnectionException } from '../exceptions/external-api.exception';
import { ViaCepResponse } from './via-cep.service';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

describe('ViaCepService', () => {
  let service: ViaCepService;
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
      providers: [
        ViaCepService,
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

    service = module.get<ViaCepService>(ViaCepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAddressByCep', () => {
    it('should return address for a valid CEP', async () => {
      const cep = '01234-567';
      const mockResponse: ViaCepResponse = {
        cep: '01234-567',
        logradouro: 'Rua Teste',
        complemento: '',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107'
      };

      const axiosResponse: AxiosResponse = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(axiosResponse));

      const result = await service.getAddressByCep(cep);

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when CEP is invalid', async () => {
      const cep = 'invalid';
      const mockResponse = {
        erro: true
      };

      const axiosResponse: AxiosResponse = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(axiosResponse));

      await expect(service.getAddressByCep(cep)).rejects.toThrow(
        ExternalApiResponseException
      );
    });

    it('should throw error when API returns error', async () => {
      const cep = '01234-567';
      const mockError = new Error('API Error');

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getAddressByCep(cep)).rejects.toThrow(
        ExternalApiConnectionException
      );
    });
  });
}); 