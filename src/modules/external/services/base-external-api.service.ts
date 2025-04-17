import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  ExternalApiException,
  ExternalApiTokenException,
  ExternalApiConnectionException,
  ExternalApiResponseException,
  ExternalApiTimeoutException,
} from '../exceptions/external-api.exception';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseExternalApiService {
  protected readonly logger: Logger;
  protected readonly serviceName: string;
  protected readonly baseUrl: string;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
    serviceName: string,
    baseUrl: string,
  ) {
    this.serviceName = serviceName;
    this.baseUrl = baseUrl;
    this.logger = new Logger(serviceName);
    this.logger.log(`🚀 Inicializando serviço ${serviceName} com URL base: ${baseUrl}`);
  }

  protected getToken(key: string): string {
    const token = this.configService.get<string>(key);
    this.logger.log(`🔑 Obtendo token para ${key}: ${token ? 'Token encontrado' : 'Token não encontrado'}`);
    if (!token) {
      throw new ExternalApiTokenException(this.serviceName);
    }
    return token;
  }

  protected async get<T>(url: string): Promise<T> {
    try {
      this.logger.log(`🌐 Fazendo requisição GET para: ${url}`);
      const response = await firstValueFrom(this.httpService.get<T>(url));
      this.logger.log(`📥 Resposta recebida: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Erro na requisição GET: ${error.message}`, error.stack);
      if (error.response) {
        throw new ExternalApiResponseException(
          `Error in ${this.serviceName} API response`,
          error.response.data
        );
      }
      throw new ExternalApiConnectionException(
        `Error connecting to ${this.serviceName} API`,
        error.message
      );
    }
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    try {
      this.logger.log(`🌐 Fazendo requisição POST para: ${url}`);
      this.logger.log(`📤 Dados enviados: ${JSON.stringify(data)}`);
      const response = await firstValueFrom(this.httpService.post<T>(url, data));
      this.logger.log(`📥 Resposta recebida: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Erro na requisição POST: ${error.message}`, error.stack);
      if (error.response) {
        throw new ExternalApiResponseException(
          `Error in ${this.serviceName} API response`,
          error.response.data
        );
      }
      throw new ExternalApiConnectionException(
        `Error connecting to ${this.serviceName} API`,
        error.message
      );
    }
  }
} 