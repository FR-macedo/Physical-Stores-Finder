import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GoogleMapsApiError } from '../exceptions/google-maps-api.error';
import { BaseExternalApiService } from './base-external-api.service';
import { firstValueFrom } from 'rxjs';

export interface GoogleMapsDistanceResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}

export interface GoogleMapsGeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
}

export interface GoogleMapsResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}

export interface RouteData {
  distance: number;
  duration: number;
}

@Injectable()
export class GoogleMapsService extends BaseExternalApiService {
  protected readonly logger = new Logger(GoogleMapsService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, 'Google Maps', 'https://maps.googleapis.com/maps/api');
  }

  async getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number }> {
    try {
      this.logger.log(`🔍 Iniciando geocodificação do endereço: ${address}`);
      
      const apiKey = this.getToken('GOOGLE_MAPS_API_KEY');
      this.logger.log(`🔑 API Key obtida: ${apiKey ? 'Sim' : 'Não'}`);
      
      const encodedAddress = encodeURIComponent(address);
      const url = `${this.baseUrl}/geocode/json?address=${encodedAddress}&key=${apiKey}`;
      this.logger.log(`🌐 Fazendo requisição para: ${url}`);

      const response = await this.get<GoogleMapsGeocodeResponse>(url);
      this.logger.log('📥 Resposta recebida da API do google!');

      if (response.status !== 'OK' || !response.results.length) {
        this.logger.warn(`⚠️ Falha na geocodificação: ${response.status}`);
        throw new GoogleMapsApiError(
          `Failed to geocode address: ${address}`,
          response
        );
      }

      const coordinates = response.results[0].geometry.location;
      this.logger.log(`✅ Coordenadas obtidas: ${JSON.stringify(coordinates)}`);
      return coordinates;
    } catch (error) {
      this.logger.error(`❌ Erro na geocodificação: ${error.message}`, error.stack);
      throw new GoogleMapsApiError(
        `Error geocoding address: ${address}`,
        error
      );
    }
  }

  async calculateDistance(
    origin: string | { type: string; coordinates: number[] },
    destination: string | { type: string; coordinates: number[] }
  ): Promise<RouteData> {
    try {
      this.logger.log(`🔍 Calculando distância entre: ${JSON.stringify(origin)} e ${JSON.stringify(destination)}`);
      
      const apiKey = this.getToken('GOOGLE_MAPS_API_KEY');
      this.logger.log(`🔑 API Key obtida: ${apiKey ? 'Sim' : 'Não'}`);
      
      const originStr = typeof origin === 'string' ? origin : `${origin.coordinates[1]},${origin.coordinates[0]}`;
      const destinationStr = typeof destination === 'string' ? destination : `${destination.coordinates[1]},${destination.coordinates[0]}`;
      
      this.logger.log(`📍 Origem formatada: ${originStr}`);
      this.logger.log(`📍 Destino formatado: ${destinationStr}`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/directions/json`, {
          params: {
            origin: originStr,
            destination: destinationStr,
            key: apiKey,
          },
        })
      );

      this.logger.log(`📥 Resposta recebida da API do google!!`);

      if (!response.data.routes || response.data.routes.length === 0) {
        this.logger.warn(`⚠️ Nenhuma rota encontrada`);
        throw new GoogleMapsApiError('Nenhuma rota encontrada');
      }

      const route = response.data.routes[0].legs[0];
      const result = {
        distance: route.distance.value,
        duration: route.duration.value,
      };
      
      this.logger.log(`✅ Distância calculada: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Erro ao calcular distância: ${error.message}`, error.stack);
      throw new GoogleMapsApiError('Erro ao calcular distância');
    }
  }

  private calculateHaversineDistance(origin: string, destination: string): { distance: number; duration: number } {
    try {
      // Implementação simplificada do cálculo Haversine
      // Em um cenário real, você precisaria primeiro geocodificar os endereços
      // e então calcular a distância entre as coordenadas
      this.logger.warn('Método Haversine não implementado completamente');
      return {
        distance: 0,
        duration: 0,
      };
    } catch (error) {
      this.logger.error('Erro no cálculo Haversine:', error);
      return {
        distance: 0,
        duration: 0,
      };
    }
  }
} 