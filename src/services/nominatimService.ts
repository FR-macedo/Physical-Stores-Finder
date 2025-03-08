// services/nominatimService.ts
import axios from 'axios';
import { logger } from '../config/logger';
import { config } from '../config/env';
import { AppError } from '../utils/appError';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class NominatimService {
  static async getCoordinates(address: string): Promise<Coordinates> {
    try {
      const response = await axios.get(config.NOMINATIM_URL, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': `Physical-Stores-Finder/1.0 ${config.EMAIL}`
        }
      });
      
      if (response.data.length === 0) {
        logger.warn(`Nenhuma coordenada encontrada para o endereço: ${address}`);
        throw AppError.badRequest('Não foi possível localizar coordenadas para o endereço informado');
      }
      
      const location = response.data[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon)
      };
    } catch (error) {
      logger.error(`Erro ao obter coordenadas do Nominatim: ${error}`);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw AppError.internal('Erro ao obter coordenadas do endereço', { originalError: error.message });
      }
      throw AppError.internal('Erro ao obter coordenadas do endereço', { originalError: String(error) });
    }
  }
}