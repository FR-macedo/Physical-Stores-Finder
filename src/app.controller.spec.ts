import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './providers/database/database.service';
import { DatabaseConnection } from './providers/database/database.connection';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let databaseService: DatabaseService;

  const mockAppService = {
    getHello: jest.fn().mockReturnValue('Hello World!'),
  };

  const mockDatabaseService = {
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockDatabaseConnection = {
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: DatabaseConnection,
          useValue: mockDatabaseConnection,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    databaseService = app.get<DatabaseService>(DatabaseService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
