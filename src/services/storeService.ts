import Store, { IStore } from "../models/store";
import { ViaCepService } from "./viaCepService";
import { NominatimService, Coordinates } from "./nominatimService";
import { OpenRouteService } from "./openRouteService";
import { logger } from "../config/logger";
import { config } from "../config/env";
import { calculateHaversineDistance } from "../utils/haversine";
import { AppError } from "../utils/appError";
import { Document } from "mongoose";

interface RouteResponse {
  distance: number;
  duration: number;
}

interface StoreWithDistance {
  store: Document<IStore> & IStore & { _id: unknown; __v: number };
  routeData: RouteResponse;
}

interface NearestStoresResponse {
  nearestStore: StoreWithDistance;
  otherStores: StoreWithDistance[];
}

export class StoreService {
  static async findNearestStores(userCep: string): Promise<NearestStoresResponse> {
    try {
      logger.info(`Iniciando busca de lojas para o CEP: ${userCep}`);

      // 1. Obtendo o endereço pelo ViaCep
      const userAddress = await ViaCepService.getAddressByCep(userCep);
      const fullAddress = `${userAddress.logradouro}, ${userAddress.localidade} - ${userAddress.uf}, ${userAddress.cep}`;
      logger.info(`Endereço obtido: ${fullAddress}`);

      // 2. Obtendo coordenadas pelo Nominatim
      const userCoordinates = await NominatimService.getCoordinates(fullAddress);
      logger.info(`Coordenadas obtidas: ${userCoordinates.longitude}, ${userCoordinates.latitude}`);

      // 3. Obtendo todas as lojas do banco de dados
      const allStores = await Store.find({});
      logger.info(`Total de lojas encontradas no banco: ${allStores.length}`);

      if (allStores.length === 0) {
        throw AppError.notFound("Nenhuma loja cadastrada no banco de dados.");
      }

      // 4. Calcular distâncias de forma paralela
      const storesWithDistances = await this.calculateDistancesToStores(allStores, userCoordinates);

      if (storesWithDistances.length === 0) {
        throw AppError.notFound("Não há lojas dentro do raio de 100km");
      }

      const sortedStores = storesWithDistances.sort((a, b) => a.routeData.distance - b.routeData.distance);

      logger.info(`Dados retornados da loja mais próxima: ${sortedStores[0].routeData.distance}, ${sortedStores[0].routeData.duration} - ${sortedStores[0].store.name}`);

      return {
        nearestStore: this.formatStoreData(sortedStores[0]),
        otherStores: sortedStores.slice(1).map(item => this.formatStoreData(item))
      };
    } catch (error) {
      logger.error(`Erro ao buscar lojas próximas: ${error}`);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw AppError.internal("Erro ao buscar lojas próximas", { originalError: error.message });
      }
      throw AppError.internal("Erro ao buscar lojas próximas", { originalError: String(error) });
    }
  }
  
  private static async calculateDistancesToStores(
    stores: any[], 
    userCoordinates: Coordinates
  ): Promise<StoreWithDistance[]> {
    const storesWithDistances = (await Promise.all(
      stores.map(async (store) => {
        const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const storeCoordinates: Coordinates = {
          latitude: store.location.coordinates[1],
          longitude: store.location.coordinates[0],
        };
  
        try {
          logger.info(`[${requestId}] Calculating route to store: ${store.name}...`);
          const route = await OpenRouteService.getRoute(userCoordinates, storeCoordinates);
  
          let routeResponse: RouteResponse = {
            distance: 0,
            duration: 0,
          };
  
          if (route) {
            logger.info(`[${requestId}] OpenRouteAPI response for ${store.name} [Distance, Duration]: [${route.distance}, ${route.duration}]`);
            routeResponse = { distance: route.distance, duration: route.duration };
          } else {
            logger.warn(`[${requestId}] OpenRouteService failed for store: ${store.name}, using Haversine.`);
            routeResponse.distance = calculateHaversineDistance(userCoordinates, storeCoordinates);
            routeResponse.duration = routeResponse.distance / config.FALLBACK_SPEED_KMH;
          }
  
          if (routeResponse.distance <= 100) {
            return { store, routeData: routeResponse };
          }
        } catch (error) {
          logger.error(`[${requestId}] Error calculating distance to store ${store.name}: ${error}`);
        }
  
        return null;
      })
    )).filter((store): store is StoreWithDistance => store !== null);
    
    return storesWithDistances;
  }
  
  private static formatStoreData(storeData: StoreWithDistance): StoreWithDistance {
    return {
      store: storeData.store,
      routeData: {
        distance: storeData.routeData.distance,
        duration: storeData.routeData.duration
      }
    };
  }
}