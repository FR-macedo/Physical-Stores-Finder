import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseConnection } from './database.connection';
import { Logger } from '@nestjs/common';

describe('DatabaseConnection', () => {
  let connection: DatabaseConnection;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConnection,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    connection = module.get<DatabaseConnection>(DatabaseConnection);
    // Substituir o logger interno por um mock
    (connection as any).logger = mockLogger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('should connect to database successfully', async () => {
      const url = 'mongodb://localhost:27017/test';

      await connection.connect(url);

      expect(mockLogger.log).toHaveBeenCalledWith(`Conectando ao banco de dados: ${url}`);
    });

    it('should throw error if database URL is not configured', async () => {
      await expect(connection.connect(null)).rejects.toThrow('URL do banco de dados não configurada');
    });
  });

  describe('disconnect', () => {
    it('should disconnect from database successfully', async () => {
      await connection.disconnect();

      expect(mockLogger.log).toHaveBeenCalledWith('Desconectando do banco de dados');
    });
  });
}); 