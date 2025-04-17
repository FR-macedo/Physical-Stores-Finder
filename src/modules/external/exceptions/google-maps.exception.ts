import { HttpStatus } from '@nestjs/common';
import { ExternalApiException } from './external-api.exception';

export class GoogleMapsException extends ExternalApiException {
  constructor(message: string, details?: string) {
    super(
      message,
      HttpStatus.BAD_GATEWAY,
      'GOOGLE_MAPS_ERROR',
      details,
      'Google Maps API'
    );
  }
} 