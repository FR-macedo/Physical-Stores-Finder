import Store, { IStore } from '../models/store';
import { ViaCepService } from './viaCepService';
import { OpenRouteService } from './openRouteService';
import { logger } from '../config/logger';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface StoreWithDistance {
  store: IStore;
  distance: number;
}

export class StoreService {
  static async findNearestStore(userCep: string): Promise<StoreWithDistance | null> {
    try {
      // Obter coordenadas do usuário a partir do CEP
      const userAddress = await ViaCepService.getAddressByCep(userCep);
      
      // Para este exemplo, vamos usar um serviço de geocodificação fictício
      // Em um cenário real, você usaria um serviço como Google Geocoding API
      const userCoordinates: Coordinates = {
        latitude: 0, // Substituir por geocodificação real
        longitude: 0 // Substituir por geocodificação real
      };
      
      // Obter todas as lojas do banco de dados
      const stores = await Store.find();
      
      if (stores.length === 0) {
        return null;
      }
      
      let nearestStore: StoreWithDistance | null = null;
      
      // Calcular a distância para cada loja
      for (const store of stores) {
        const storeCoordinates: Coordinates = {
          latitude: store.latitude,
          longitude: store.longitude
        };
        
        const route = await OpenRouteService.getRoute(userCoordinates, storeCoordinates);
        
        if (!route) {
          continue;
        }
        
        const distanceInKm = route.distance / 1000;
        
        // Verificar se é a loja mais próxima até agora
        if (!nearestStore || distanceInKm < nearestStore.distance) {
          nearestStore = {
            store,
            distance: distanceInKm
          };
        }
      }
      
      return nearestStore;
    } catch (error) {
      logger.error(`Erro ao buscar a loja mais próxima: ${error}`);
      return null;
    }
  }
}