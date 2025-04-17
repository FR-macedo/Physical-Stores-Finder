import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { BaseExternalApiService } from './base-external-api.service';
import { MelhorEnvioApiError } from '../exceptions/melhor-envio-api.error';

export interface MelhorEnvioShippingOption {
  id: number;
  name: string;
  price: number;
  custom_price?: number;
  delivery_time: number;
  custom_delivery_time?: number;
  delivery_range?: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string;
  };
}

@Injectable()
export class MelhorEnvioService extends BaseExternalApiService {
  protected readonly logger = new Logger(MelhorEnvioService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, 'Melhor Envio', 'https://melhorenvio.com.br/api/v2');
    this.logger.log('🚀 MelhorEnvioService inicializado');
  }

  async calculateShipping(fromPostalCode: string, toPostalCode: string): Promise<MelhorEnvioShippingOption[]> {
    const methodName = 'calculateShipping';
    this.logger.debug(`[${methodName}] CEP origem: ${fromPostalCode}, CEP destino: ${toPostalCode}`);

    try {
      const token = this.getToken('services.melhorEnvio.token');

      if (!token) {
        this.logger.error(`[${methodName}] ⚠️ Token não encontrado ou inválido`);
        throw new MelhorEnvioApiError('Token de autenticação ausente ou inválido');
      }

      const url = `${this.baseUrl}/me/shipment/calculate`;

      this.logger.log(`[${methodName}] 🌐 Fazendo requisição POST para: ${url}`);
      this.logger.debug(`[${methodName}] 🔑 Token utilizado (parcial): ${token.substring(0, 10)}...`);

      this.httpService.axiosRef.defaults.headers.common = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'TestApp (test@example.com)'
      };

      const requestData = 
      {
          'from': {
            'postal_code': fromPostalCode
          },
          'to': {
            'postal_code': toPostalCode
          },
        "products": [
            {
                "id": "1",
                "width": 15,
                "height": 10,
                "length": 20,
                "weight": 1,
                "insurance_value": 0,
                "quantity": 1
            }
        ],
        "options": {
            "receipt": false,
            "own_hand": false,
            "insurance_value": 0,
            "reverse": false,
            "non_commercial": true
        },
        "services": [
            "1",
            "2"
        ],
        "validate": true
        
        // from: { postal_code: fromPostalCode },
        // to: { postal_code: toPostalCode },
        // package: {
        //   height: 15, //cm
        //   width: 15, //cm
        //   length: 15, //cm
        //   weight: 1  //kg
        // },
        // options: {
        //   insurance_value: 100,
        //   receipt: false,
        //   own_hand: false
        // }
      };

      this.logger.log(`[${methodName}] 📤 Dados enviados: ${JSON.stringify(requestData, null, 2)}`);

      const response = await this.post<MelhorEnvioShippingOption[]>(url, requestData);

      if (!response || response.length === 0) {
        this.logger.warn(`[${methodName}] ⚠️ Nenhuma opção de frete retornada`);
        throw new MelhorEnvioApiError('Nenhuma opção de frete encontrada');
      }

      this.logger.log(`[${methodName}] ✅ ${response.length} opções de frete encontradas`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`[${methodName}] ❌ Erro na requisição POST: ${error.message}`);
        this.logger.error(`[${methodName}] 📥 Corpo da resposta de erro: ${JSON.stringify(error.response?.data, null, 2)}`);
        this.logger.error(`[${methodName}] 🔁 Status da resposta: ${error.response?.status}`);
      } else {
        this.logger.error(`[${methodName}] ❌ Erro inesperado: ${error.message}`, error.stack);
      }

      throw new MelhorEnvioApiError('Erro ao calcular opções de frete', error);
    }
  }
}
