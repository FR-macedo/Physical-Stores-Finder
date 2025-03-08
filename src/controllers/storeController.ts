import { Request, Response } from "express";
import { StoreService } from "../services/storeService";
import { logger } from "../config/logger";
import { formatStoreOutput } from "../utils/formatters";

export class StoreController {
  static async findNearestStores(req: Request, res: Response): Promise<void> {
    const { cep } = req.params;
    
    try {
      const { nearestStore, otherStores } = await StoreService.findNearestStores(cep);
      logger.info("Serviço StoreService retornou as lojas com sucesso para o controlador StoreController...");
      
      res.status(200).json({
        message: "Lojas encontradas com sucesso",
        nearestStore: formatStoreOutput(nearestStore),
        otherStores: otherStores.map(store => formatStoreOutput(store))
      });
    } catch (error) {
      throw error;
    }
  }
}