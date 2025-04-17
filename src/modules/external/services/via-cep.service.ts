import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BaseExternalApiService } from './base-external-api.service';
import { ExternalApiResponseException } from '../exceptions/external-api.exception';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable()
export class ViaCepService extends BaseExternalApiService {
  protected readonly logger = new Logger(ViaCepService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, 'Via CEP', 'https://viacep.com.br/ws');
  }

  async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    try {
      this.logger.log(`🔍 Iniciando busca de endereço para o CEP: ${cep}`);
      
      // Validar formato do CEP
      if (!/^\d{5}-?\d{3}$/.test(cep)) {
        this.logger.warn(`❌ CEP inválido: ${cep}`);
        throw new ExternalApiResponseException('CEP inválido');
      }

      // Remover hífen se existir
      const cleanCep = cep.replace('-', '');
      this.logger.log(`📍 CEP formatado: ${cleanCep}`);

      const url = `${this.baseUrl}/${cleanCep}/json`;
      this.logger.log(`🌐 Fazendo requisição para: ${url}`);

      const response = await this.get<ViaCepResponse>(url);
      
      if (response.erro) {
        this.logger.warn(`⚠️ CEP não encontrado: ${cep}`);
        throw new ExternalApiResponseException('CEP não encontrado');
      }

      this.logger.log(`✅ Endereço encontrado: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Erro ao buscar endereço: ${error.message}`, error.stack);
      throw error;
    }
  }
} 