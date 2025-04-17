import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseApiError } from '../../../common/exceptions/base-api.error';

export class ExternalApiException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_GATEWAY,
    public readonly code?: string,
    public readonly details?: any,
    public readonly service?: string,
  ) {
    super(
      {
        message,
        code,
        details,
        service,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class ExternalApiTokenException extends ExternalApiException {
  constructor(service: string) {
    super(
      `Token do serviço ${service} não configurado`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      `${service.toUpperCase()}_TOKEN_MISSING`,
      null,
      service,
    );
  }
}

export class ExternalApiConnectionException extends ExternalApiException {
  constructor(service: string, details?: any) {
    super(
      `Erro de conexão com o serviço ${service}`,
      HttpStatus.BAD_GATEWAY,
      `${service.toUpperCase()}_CONNECTION_ERROR`,
      details,
      service,
    );
  }
}

export class ExternalApiResponseException extends BaseApiError {
  constructor(message: string, error?: any) {
    super(message, 'EXTERNAL_API_ERROR', error);
  }
}

export class ExternalApiTimeoutException extends ExternalApiException {
  constructor(service: string) {
    super(
      `Tempo limite excedido ao comunicar com o serviço ${service}`,
      HttpStatus.GATEWAY_TIMEOUT,
      `${service.toUpperCase()}_TIMEOUT`,
      null,
      service,
    );
  }
} 