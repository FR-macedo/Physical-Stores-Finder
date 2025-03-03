import axios from 'axios';
import { logger } from '../config/logger';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class NominatimService {
  static async getCoordinates(address: string): Promise<Coordinates | null> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'YourAppName/1.0 (your@email.com)'
        }
      });
      
      if (response.data.length === 0) {
        logger.warn(`Nenhuma coordenada encontrada para o endereço: ${address}`);
        return null;
      }
      
      const location = response.data[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon)
      };
    } catch (error) {
      logger.error(`Erro ao obter coordenadas do Nominatim: ${error}`);
      return null;
    }
  }
}
