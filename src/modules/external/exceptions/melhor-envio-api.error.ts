import { BaseApiError } from '../../../common/exceptions/base-api.error';

export class MelhorEnvioApiError extends BaseApiError {
  constructor(message: string, error?: any) {
    super(message, 'MELHOR_ENVIO_API_ERROR', error);
  }
} 