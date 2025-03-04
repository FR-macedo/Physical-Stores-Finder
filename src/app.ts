import express from 'express';
import routes from './routes';
import { configureDatabase } from './config/database';
import { logger } from './config/logger';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Erro: ${err.message}`);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

configureDatabase();

export default app;