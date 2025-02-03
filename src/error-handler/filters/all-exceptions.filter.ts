import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseException } from '../exceptions';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { ErrorHandlerService } from '../error-handler.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // console.log(exception);

    const errorResponse = this.createErrorResponse(exception, request);

    httpAdapter.reply(
      ctx.getResponse(),
      errorResponse,
      errorResponse.statusCode,
    );
    this.errorHandlerService.logError(exception, errorResponse);
  }

  private createErrorResponse(exception: unknown, request: any): ErrorResponse {
    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);
    const error = this.getErrorType(exception);

    return {
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId: request.headers['x-correlation-id'],
    };
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      console.log(exception);
      return exception.getStatus();
    }
    if (exception instanceof BaseException) {
      return exception.statusCode;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }
    return 'Internal server error';
  }

  private getErrorType(exception: unknown): string {
    if (exception instanceof BaseException) {
      // console.log(exception);
      return exception.error;
    }
    if (exception instanceof HttpException) {
      // console.log(exception);
      return 'Http Exception';
    }
    return 'Internal Server Error';
  }
}
