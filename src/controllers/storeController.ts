import { Request, Response } from 'express';
import { StoreService } from '../services/storeService';
import { logger } from '../config/logger';

export class StoreController {
  static async findNearestStore(req: Request, res: Response): Promise<void> {
    try {
      const { cep } = req.params;
      
      if (!cep) {
        res.status(400).json({ error: 'CEP é obrigatório' });
        return;
      }
      
      const nearestStore = await StoreService.findNearestStore(cep);
      
      if (!nearestStore) {
        res.status(404).json({ message: 'Não foi possível encontrar lojas próximas' });
        return;
      }
      
      if (nearestStore.distance > 100) {
        res.status(200).json({ 
          message: 'Não há lojas dentro de 100km da sua localização',
          distance: nearestStore.distance
        });
        return;
      }
      
      res.status(200).json({
        message: 'Loja mais próxima encontrada',
        store: nearestStore.store,
        distance: nearestStore.distance
      });
    } catch (error) {
      logger.error(`Erro ao buscar loja mais próxima: ${error}`);
      res.status(500).json({ error: 'Erro ao processar a solicitação' });
    }
  }
}