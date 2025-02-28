import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../config/logger';

interface ViaCepResponse {
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
}

export class ViaCepService {
  static async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    try {
      // Remove caracteres não numéricos do CEP
      const cleanCep = cep.replace(/\D/g, '');
      
      const response = await axios.get<ViaCepResponse>(`${config.VIA_CEP_URL}/${cleanCep}/json/`);
      
      if ('erro' in response.data && response.data.erro) {
        throw new Error('Falha na busca pelo CEP');
      }
      
      return response.data;
    } catch (error) {
      logger.error(`Erro ao consultar ViaCEP: ${error}`);
      throw new Error('Erro ao consultar o CEP');
    }
  }
}