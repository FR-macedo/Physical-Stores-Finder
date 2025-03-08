import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/physical-stores',
  EMAIL: process.env.EMAIL || "meu@email.com",
  VIA_CEP_URL: 'https://viacep.com.br/ws',
  OPEN_ROUTE_SERVICE_API_KEY: process.env.OPEN_ROUTE_SERVICE_API_KEY || '',
  OPEN_ROUTE_SERVICE_URL: 'https://api.openrouteservice.org/v2/directions/driving-car',
  NOMINATIM_URL: "https://nominatim.openstreetmap.org/search",
  MAX_DISTANCE_KM: 100,
  FALLBACK_SPEED_KMH: 60
};