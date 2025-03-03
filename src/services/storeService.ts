import Store, { IStore } from "../models/store";
import { ViaCepService } from "./viaCepService";
import { OpenRouteService } from "./openRouteService";
import { NominatimService, Coordinates } from "./nominatimService";
import { logger } from "../config/logger";

interface StoreWithDistance {
  store: IStore;
  distance: number;
  coordinates: Coordinates;
}

export class StoreService {
  static async findNearestStore(
    userCep: string
  ): Promise<StoreWithDistance | null> {
    try {
      const userAddress = await ViaCepService.getAddressByCep(userCep);

      if (!userAddress) {
        logger.warn(`Endereço não encontrado para o CEP: ${userCep}`);
        return null;
      }

      const formattedAddress = `${userAddress.logradouro}, ${userAddress.bairro}, ${userAddress.localidade}, ${userAddress.uf}, ${userAddress.cep}, Brasil`;

      const userCoordinates = await NominatimService.getCoordinates(
        formattedAddress
      );

      if (!userCoordinates) {
        logger.warn(
          `Não foi possível obter coordenadas para o endereço: ${userAddress}`
        );
        return null;
      }

      const stores = await Store.find();

      if (stores.length === 0) {
        return null;
      }

      let nearestStore: StoreWithDistance | null = null;

      for (const store of stores) {
        const storeCoordinates: Coordinates = {
          latitude: store.latitude,
          longitude: store.longitude,
        };

        const route = await OpenRouteService.getRoute(
          userCoordinates,
          storeCoordinates
        );

        if (!route) {
          continue;
        }

        const distanceInKm = route.distance; // Já vem em quilômetros do OpenRouteService

        if (!nearestStore || distanceInKm < nearestStore.distance) {
          nearestStore = {
            store,
            distance: distanceInKm,
            coordinates: storeCoordinates,
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
