import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseConnection } from './database.connection';
import { Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockDatabaseConnection: jest.Mocked<DatabaseConnection>;
  let mockLogger: jest.Mocked<Logger>;
  let mockConnection: Partial<Connection>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    } as any;

    mockDatabaseConnection = {
      connect: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    mockConnection = {
      readyState: 1,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DatabaseConnection,
          useValue: mockDatabaseConnection,
        },
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    // Substituir o logger interno por um mock
    (service as any).logger = mockLogger;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    it('should connect to database successfully', async () => {
      const url = 'mongodb://localhost:27017/test';
      mockConfigService.get.mockReturnValue(url);
      mockDatabaseConnection.connect.mockResolvedValue(undefined);

      await service.connect();

      expect(mockConfigService.get).toHaveBeenCalledWith('MONGODB_URI');
      expect(mockDatabaseConnection.connect).toHaveBeenCalledWith(url);
      expect(mockLogger.log).toHaveBeenCalledWith('Conexão com o banco de dados estabelecida com sucesso');
    });

    it('should throw error if database URL is not configured', async () => {
      mockConfigService.get.mockReturnValue(null);

      await expect(service.connect()).rejects.toThrow('URL do banco de dados não configurada');
      expect(mockDatabaseConnection.connect).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith('URL do banco de dados não configurada');
    });
  });

  describe('disconnect', () => {
    it('should disconnect from database successfully', async () => {
      mockDatabaseConnection.disconnect.mockResolvedValue(undefined);

      await service.disconnect();

      expect(mockDatabaseConnection.disconnect).toHaveBeenCalled();
      expect(mockLogger.log).toHaveBeenCalledWith('Desconectado do banco de dados');
    });
  });

  describe('checkHealth', () => {
    it('should return true when database is connected', async () => {
      Object.defineProperty(mockConnection, 'readyState', { value: 1 });

      const result = await service.checkHealth();

      expect(result).toBe(true);
    });

    it('should return false when database is not connected', async () => {
      Object.defineProperty(mockConnection, 'readyState', { value: 0 });

      const result = await service.checkHealth();

      expect(result).toBe(false);
    });

    it('should return false and log error when check fails', async () => {
      const error = new Error('Failed to check database state');
      Object.defineProperty(mockConnection, 'readyState', { 
        get: () => { throw error; }
      });

      const result = await service.checkHealth();

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Erro ao verificar a saúde do banco de dados:',
        error
      );
    });
  });
});
