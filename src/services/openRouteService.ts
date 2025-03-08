// services/openRouteService.ts
import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { Coordinates } from './nominatimService';

interface RouteResponse {
  distance: number; // em quilômetros
  duration: number; // em minutos
}

export class OpenRouteService {
  static async getRoute(
    start: Coordinates,
    end: Coordinates
  ): Promise<RouteResponse | null> {
    try {
      const response = await axios.get(config.OPEN_ROUTE_SERVICE_URL, {
        params: {
          api_key: config.OPEN_ROUTE_SERVICE_API_KEY,
          start: `${start.longitude},${start.latitude}`,
          end: `${end.longitude},${end.latitude}`,
        },
      });

      
      
      if (response.status === 200) {
        const route = response.data.features?.[0];
        if (!route) {
          logger.warn("Nenhuma rota encontrada.");
          return null;
        }
        return {
          
          distance: route.properties.summary.distance / 1000,
          duration: route.properties.summary.duration / 60,
        };
      }
      return null;
    } catch (error) {
      this.handleOpenRouteServiceError(error);
      return null;
    }
  }
  
  private static handleOpenRouteServiceError(error: any): void {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          logger.error("Erro no OpenRouteService 400: Requisição inválida.");
          break;
        case 404:
          logger.error("Erro OpenRouteService 404: Elemento não encontrado.");
          break;
        // ... outros casos mantidos como antes ...
        default:
          logger.error(`Erro inesperado OpenRouteService: ${status}`);
      }
    } else {
      logger.error(`Erro ao consultar OpenRouteService: ${error.message}`);
    }
  }
}