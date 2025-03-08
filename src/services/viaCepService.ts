// services/viaCepService.ts
import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../utils/appError';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd: string;
}

export class ViaCepService {
  static async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    try {
      // CEP já deve vir limpo do middleware
      const response = await axios.get<ViaCepResponse>(`${config.VIA_CEP_URL}/${cep}/json/`);
      
      if ('erro' in response.data && response.data.erro) {
        logger.warn(`CEP ${cep} não encontrado`);
        throw AppError.badRequest('CEP não encontrado');
      }
      
      return response.data;
    } catch (error) {
      logger.error(`Erro ao consultar ViaCEP: ${error}`);
      
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error) {
        throw AppError.internal('Erro ao consultar o serviço de CEP', { originalError: error.message });
      }
      
      throw AppError.internal('Erro ao consultar o serviço de CEP', { originalError: String(error) });
    }
  }
}