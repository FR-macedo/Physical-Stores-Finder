import { BaseApiError } from '../../../common/exceptions/base-api.error';

export class StoreValidationError extends BaseApiError {
  constructor(message: string, error?: any) {
    super(message, 'STORE_VALIDATION_ERROR', error);
  }
} 