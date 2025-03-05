import { Request, Response } from "express";
import { StoreService } from "../services/storeService";
import { logger } from "../config/logger";

export class StoreController {
  static async findNearestStores(req: Request, res: Response): Promise<void> {
    try {
      const { cep } = req.params;

      if (!cep) {
        res.status(400).json({ error: "CEP é obrigatório" });
        return;
      }

      try {
        const { nearestStore, otherStores } =
          await StoreService.findNearestStores(cep);

        res.status(200).json({
          message: "Lojas encontradas com sucesso",
          nearestStore: {
            store: nearestStore.store,
            distance: nearestStore.distance,
          },
          otherStores: otherStores.map((store) => ({
            store: store.store,
            distance: store.distance,
          })),
        });
      } catch (serviceError: any) {
        if (
          serviceError.message.includes("Não há lojas dentro do raio de 100km")
        ) {
          res.status(404).json({
            message: "Não há lojas dentro do raio de 100km",
            error: serviceError.message,
          });
        } else if (
          serviceError.message.includes(
            "Não foi possível localizar coordenadas"
          )
        ) {
          res.status(400).json({
            message: "Erro ao localizar coordenadas",
            error: serviceError.message,
          });
        } else {
          res.status(500).json({
            message: "Erro ao buscar lojas próximas",
            error: serviceError.message,
          });
        }
      }
    } catch (error) {
      logger.error(`Erro inesperado no controller: ${error}`);
      res.status(500).json({
        message: "Erro interno do servidor",
        error: String(error),
      });
    }
  }
}
