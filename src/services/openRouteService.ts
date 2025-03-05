import axios from "axios";
import { config } from "../config/env";
import { logger } from "../config/logger";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface RouteResponse {
  distance: number; // em quilometros
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

      const route = response.data.features[0];

      if (!route) {
        return null;
      }

      return {
        distance: route.properties.summary.distance / 1000,
        duration: route.properties.summary.duration / 60,
      };
    } catch (error) {
      logger.error(`Erro ao consultar OpenRouteService: ${error}`);
      return null;
    }
  }
}
