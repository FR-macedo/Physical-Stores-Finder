import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly configService: ConfigService
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Verifique o tipo de exceção para determinar o status
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // Detalhes da resposta de erro
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    
    // Adicione mensagem de erro com base no ambiente
    const isProduction = this.configService.get<string>('nodeEnv') === 'production';
    
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        Object.assign(errorResponse, exceptionResponse);
      } else {
        Object.assign(errorResponse, { message: exceptionResponse });
      }
    } else {
      // No modo de produção, não exponha detalhes de erro interno
      Object.assign(errorResponse, { 
        message: isProduction 
          ? 'Erro interno do servidor' 
          : exception instanceof Error ? exception.message : 'Erro desconhecido' 
      });
      
      // Em desenvolvimento, inclua a stack trace para depuração
      if (!isProduction && exception instanceof Error) {
        Object.assign(errorResponse, { stack: exception.stack });
      }
    }
    
    // Log do erro (sempre completo para diagnóstico)
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception)
    );
    
    // Retorne a resposta formatada
    response.status(status).json(errorResponse);
  }
}