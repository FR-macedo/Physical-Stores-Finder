export class StoreResponseDto {
    storeID: string;
    storeName: string;
    takeOutInStore: boolean;
    shippingTimeInDays: number;
    latitude: string;
    longitude: string;
    address1: string;
    address2: string;
    address3: string;
    city: string;
    district: string;
    state: string;
    type: string;
    country: string;
    postalCode: string;
    telephoneNumber: string;
    emailAddress: string;
  }
  
  export class StoreWithRouteResponseDto {
    store: StoreResponseDto;
    distance: string;
    duration: string;
  }
  
  export function mapStoreToResponseDto(store: any, routeData?: any): StoreWithRouteResponseDto {
    const storeResponse: StoreResponseDto = {
      storeID: store._id?.toString() || store.id,
      storeName: store.storeName,
      takeOutInStore: store.takeOutInStore || true,
      shippingTimeInDays: store.shippingTimeInDays || 1,
      latitude: store.location?.coordinates?.[1]?.toString() || '',
      longitude: store.location?.coordinates?.[0]?.toString() || '',
      address1: store.address1,
      address2: store.address2 || '',
      address3: store.address3 || '',
      city: store.city,
      district: store.district,
      state: store.state,
      type: store.type || 'LOJA',
      country: store.country || 'Brasil',
      postalCode: store.postalCode,
      telephoneNumber: store.telephoneNumber || '',
      emailAddress: store.emailAddress || ''
    };
  
    if (routeData) {
      return {
        store: storeResponse,
        distance: formatDistance(routeData.distance),
        duration: formatDuration(routeData.duration)
      };
    }
  
    return {
      store: storeResponse,
      distance: '',
      duration: ''
    };
  }
  
  function formatDistance(distance: number): string {
    // Implementar formatação de distância conforme necessário
    if (!distance) return '';
    return `${(distance / 1000).toFixed(1)} km`;
  }
  
  function formatDuration(duration: number): string {
    // Implementar formatação de duração conforme necessário
    if (!duration) return '';
    
    const minutes = Math.round(duration / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} h`;
    }
    
    return `${hours} h ${remainingMinutes} min`;
  }