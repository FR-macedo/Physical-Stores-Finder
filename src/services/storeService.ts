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
  static async findNearestStores(userCep: string): Promise<NearestStoresResponse> {
    try {
      logger.info(`Iniciando busca de lojas para o CEP: ${userCep}`);
      
      // 1. Obtendo o endereço pelo ViaCep
      const userAddress = await ViaCepService.getAddressByCep(userCep);
      const fullAddress = `${userAddress.logradouro}, ${userAddress.localidade} - ${userAddress.uf}, ${userAddress.cep}`;
      logger.info(`Endereço obtido: ${fullAddress}`);
      
      // 2. Obtendo coordenadas pelo Nominatim
      const userCoordinates = await NominatimService.getCoordinates(fullAddress);
      if (!userCoordinates) {
        logger.warn(`Não foi possível obter coordenadas para o CEP: ${userCep}`);
        throw new Error("Não foi possível localizar coordenadas para o endereço informado");
      }
      logger.info(`Coordenadas obtidas: ${userCoordinates.latitude}, ${userCoordinates.longitude}`);
      
      // 3. Obtendo todas as lojas do banco de dados
      const allStores = await Store.find({});
      logger.info(`Total de lojas encontradas no banco: ${allStores.length}`);
      
      const storesWithDistances: StoreWithDistance[] = [];
      
      for (const store of allStores) {
        const storeCoordinates: Coordinates = {
          latitude: store.location.coordinates[0],
          longitude: store.location.coordinates[1],
        };
        
        try {
          logger.info(`Calculando rota para loja: ${store.name}...`);
          const route = await OpenRouteService.getRoute(userCoordinates, storeCoordinates);
          
          let distance;
          if (route && route.distance) {
            distance = route.distance;
          } else {
            logger.warn(`OpenRouteService falhou para loja: ${store.name}, utilizando Haversine.`);
            logger.info(`coordenadas do usuário: ${userCoordinates.latitude}, ${userCoordinates.longitude}`);
            logger.info(`coordenadas da loja: ${storeCoordinates.latitude}, ${storeCoordinates.longitude}`);
            distance = calculateHaversineDistance(userCoordinates, storeCoordinates);
          }
          
          if (distance < 0) {
            logger.warn(`Distância negativa calculada para loja: ${store.name}, verificando ordem das coordenadas.`);
            distance = Math.abs(distance);
          }
          
          logger.info(`Distância para loja ${store.name}: ${distance.toFixed(2)} km`);
          
          if (distance <= 100) {
            storesWithDistances.push({ store, distance });
          }
        } catch (error) {
          logger.error(`Erro ao calcular distância para loja ${store.name}: ${error}`);
        }
      }
      
      if (storesWithDistances.length === 0) {
        logger.error("Nenhuma loja dentro do raio de 100km foi encontrada.");
        throw new Error("Não há lojas dentro do raio de 100km");
      }
      
      // 5. Ordenando lojas por distância
      const sortedStores = storesWithDistances.sort((a, b) => a.distance - b.distance);
      
      return {
        nearestStore: sortedStores[0],
        otherStores: sortedStores.slice(1),
      };
    } catch (error) {
      logger.error(`Erro ao buscar lojas próximas: ${error}`);
      throw error;
    }
  }
}
