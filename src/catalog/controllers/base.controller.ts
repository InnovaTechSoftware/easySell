import { Response } from 'express';
import { ApiResponse } from '../../../../../shared/infrastructure/http/ApiResponse';
import {
  HttpException,
  HttpStatus,
} from '../../../../../shared/infrastructure/http/HttpException';

export abstract class BaseController {
  protected sendResponse<T>(
    res: Response,
    data: T,
    status: number = 200,
    message?: string,
  ) {
    return res.status(status).json(ApiResponse.success(data, status, message));
  }

  protected sendError(res: Response, error: any) {
    if (error instanceof HttpException) {
      return res
        .status(error.statusCode)
        .json(ApiResponse.error(error.statusCode, error.message));
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER)
      .json(
        ApiResponse.error(
          HttpStatus.INTERNAL_SERVER,
          error.message || 'An unexpected error occurred',
        ),
      );
  }
}
