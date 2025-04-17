import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseApiError extends HttpException {
  public readonly type: string;

  constructor(message: string, type: string, error?: any) {
    super(
      {
        message,
        type,
        error: error || message,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_GATEWAY
    );
    this.type = type;
  }
} 