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
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
        url: process.env.GOOGLE_MAPS_URL || 'https://maps.googleapis.com/maps/api',
      },
      melhorEnvio: {
        token: process.env.MELHOR_ENVIO_TOKEN || '',
        url: process.env.MELHOR_ENVIO_URL || 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
      },
      nominatim: {
        url: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search',
      },
    },
    settings: {
      maxDistanceKm: parseInt(process.env.MAX_DISTANCE_KM || '100', 10),
      fallbackSpeedKmh: parseInt(process.env.FALLBACK_SPEED_KMH || '60', 10),
      pdvDeliveryFee: parseFloat(process.env.PDV_DELIVERY_FEE || '15.00'),
      pdvMaxDeliveryDistance: parseInt(process.env.PDV_MAX_DELIVERY_DISTANCE || '50', 10),
    },
    nodeEnv: process.env.NODE_ENV || 'development',
  });