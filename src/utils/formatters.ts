import { Document } from "mongoose";
import { IStore } from "../models/store";

// Suas funções existentes
export const formatDistance = (distance: number) => {
  return {
    value: distance,
    formatted: `${distance.toFixed(2)} km`
  };
};

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration);
  const seconds = Math.round((duration - minutes) * 60); 
  
  return {
    value: duration,
    formatted: `${minutes} min e ${seconds} seg`
  };
};

interface RouteData {
  distance: number;
  duration: number;
}

interface StoreWithRouteData {
  store: Document<IStore> & IStore & { _id: unknown; __v: number };
  routeData: RouteData;
}

export const formatStoreOutput = (storeData: StoreWithRouteData) => {
  const { store, routeData } = storeData;
  
  const cleanStore = {
    id: store._id,
    name: store.name,
    address: {
      street: store.street,
      number: store.number,
      neighborhood: store.neighborhood,
      city: store.city,
      state: store.state,
      cep: store.cep
    },
    coordinates: {
      latitude: store.location.coordinates[1],
      longitude: store.location.coordinates[0]
    }
  };
  
  return {
    store: cleanStore,
    distance: formatDistance(routeData.distance),
    duration: formatDuration(routeData.duration)
  };
};