import express from 'express';
import routes from './routes';
import { configureDatabase } from './config/database';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

app.use(errorHandler);

configureDatabase();

export default app;