import express from "express";
import routes from "./routes";
import { configureDatabase } from "./config/database";
import { logger } from "./config/logger";

const app = express();

// Middleware
app.use(express.json());

// Rotas
app.use("/api", routes);

// Erro 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint não encontrado" });
});

// Middleware de erro
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(`Erro: ${err.message}`);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
);

// Iniciar conexão com o banco de dados
configureDatabase();

export default app;
