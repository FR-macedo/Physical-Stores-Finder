import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../../common/exceptions/base.exception';

export class StoreNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Store with id ${id} not found`,
      HttpStatus.NOT_FOUND,
      'STORE_NOT_FOUND'
    );
  }
}

export class StoreValidationException extends BaseException {
  constructor(message: string) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      'STORE_VALIDATION_ERROR'
    );
  }
}

export class StoreDuplicateException extends BaseException {
  constructor(name: string) {
    super(
      `Store with name ${name} already exists`,
      HttpStatus.CONFLICT,
      'STORE_DUPLICATE'
    );
  }
}

export class StoreGeocodingException extends BaseException {
  constructor(message: string) {
    super(
      message,
      HttpStatus.BAD_GATEWAY,
      'STORE_GEOCODING_ERROR'
    );
  }
}

export class StoreDistanceCalculationException extends BaseException {
  constructor(message: string) {
    super(
      message,
      HttpStatus.BAD_GATEWAY,
      'STORE_DISTANCE_CALCULATION_ERROR'
    );
  }
}

export class StoreNoNearbyException extends BaseException {
  constructor(postalCode: string) {
    super(
      `Nenhuma loja encontrada próxima ao CEP ${postalCode}`,
      HttpStatus.NOT_FOUND,
      'STORE_NO_NEARBY'
    );
  }
} 