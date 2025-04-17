import { BaseApiError } from '../../../common/exceptions/base-api.error';

export class GoogleMapsApiError extends BaseApiError {
  constructor(message: string, error?: any) {
    super(message, 'GOOGLE_MAPS_API_ERROR', error);
  }
} 