import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(resourse: string) {
    super(`${resourse} not found`, 404, 'Resource not found');
  }
}
