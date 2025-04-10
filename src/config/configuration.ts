export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/physical-stores',
    },
    email: process.env.EMAIL || 'meu@email.com',
    services: {
      viaCep: {
        url: process.env.VIA_CEP_URL || 'https://viacep.com.br/ws',
      },
      openRouteService: {
        key: process.env.OPEN_ROUTE_SERVICE_API_KEY || '',
        url: process.env.OPEN_ROUTE_SERVICE_URL || 'https://api.openrouteservice.org/v2/directions/driving-car',
      },
      nominatim: {
        url: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search',
      },
    },
    settings: {
      maxDistanceKm: parseInt(process.env.MAX_DISTANCE_KM || '100', 10),
      fallbackSpeedKmh: parseInt(process.env.FALLBACK_SPEED_KMH || '60', 10),
    },
    nodeEnv: process.env.NODE_ENV || 'development',
  });