import app from './app';
import { logger } from './config/logger';
import { config } from './config/env';

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});