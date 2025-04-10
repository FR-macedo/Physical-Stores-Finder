import mongoose from 'mongoose';
import { config } from './env';
import { logger } from './logger';

export const configureDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Conexão com o banco de dados estabelecida com sucesso');
  } catch (error) {
    logger.error('Erro ao conectar ao com o banco de dados:', error);
    process.exit(1);
  }
};