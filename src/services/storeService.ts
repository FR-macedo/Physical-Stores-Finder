import Store, { IStore } from "../models/store";
import { ViaCepService } from "./viaCepService";
import { NominatimService, Coordinates } from "./nominatimService";
import { OpenRouteService } from "./openRouteService";
import { logger } from "../config/logger";
import { calculateHaversineDistance } from "../utils/haversine";

interface StoreWithDistance {
  store: IStore;
  distance: number;
}

interface NearestStoresResponse {
  nearestStore: StoreWithDistance;
  otherStores: StoreWithDistance[];
}

export class StoreService {
  static async findNearestStores(
    userCep: string
  ): Promise<NearestStoresResponse> {
    try {
      const userAddress = await ViaCepService.getAddressByCep(userCep);

      const fullAddress = `${userAddress.logradouro}, ${userAddress.localidade} - ${userAddress.uf}, ${userAddress.cep}`;

      const userCoordinates = await NominatimService.getCoordinates(
        fullAddress
      );

      if (!userCoordinates) {
        logger.warn(
          `Não foi possível obter coordenadas para o CEP: ${userCep}`
        );
        throw new Error(
          "Não foi possível localizar coordenadas para o endereço informado"
        );
      }

      const nearbyStores = await Store.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                userCoordinates.longitude,
                userCoordinates.latitude,
              ],
            },
            $maxDistance: 100000, // 100 km em metros
          },
        },
      });

      if (nearbyStores.length === 0) {
        throw new Error("Não há lojas dentro do raio de 100km");
      }

      const storesWithDistances: StoreWithDistance[] = [];

      for (const store of nearbyStores) {
        try {
          const storeCoordinates: Coordinates = {
            latitude: store.location.coordinates[1],
            longitude: store.location.coordinates[0],
          };

          let distance: number;
          const route = await OpenRouteService.getRoute(
            userCoordinates,
            storeCoordinates
          );

          distance = route
            ? route.distance
            : this.calculateFallbackDistance(userCoordinates, storeCoordinates);

          storesWithDistances.push({
            store,
            distance,
          });
        } catch (error) {
          logger.error(`Erro ao calcular distância para loja: ${error}`);
          continue;
        }
      }

      const sortedStores = storesWithDistances.sort(
        (a, b) => a.distance - b.distance
      );

      return {
        nearestStore: sortedStores[0],
        otherStores: sortedStores.slice(1),
      };
    } catch (error) {
      logger.error(`Erro ao buscar lojas próximas: ${error}`);
      throw error;
    }
  }

  private static calculateFallbackDistance(
    point1: Coordinates,
    point2: Coordinates
  ): number {
    return calculateHaversineDistance(point1, point2);
  }
}
