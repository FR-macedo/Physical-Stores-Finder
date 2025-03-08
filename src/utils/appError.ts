export class AppError extends Error {
    statusCode: number;
    details?: any;
  
    constructor(message: string, statusCode = 500, details?: any) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      Object.setPrototypeOf(this, AppError.prototype);
    }
  
    static badRequest(message: string, details?: any) {
      return new AppError(message, 400, details);
    }
  
    static notFound(message: string, details?: any) {
      return new AppError(message, 404, details);
    }
  
    static internal(message: string, details?: any) {
      return new AppError(message, 500, details);
    }
  }