import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class BusinessException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, 'Business rule violation');
  }
}
