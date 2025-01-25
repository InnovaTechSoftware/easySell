import { Injectable } from '@nestjs/common';
import { LoggerFactory } from '../abstract-factories/logger-factory.abstract';
import { FileLoggerStrategy } from '../strategies/file-logger.strategy';

@Injectable()
export class FileLoggerFactory extends LoggerFactory {
  constructor(strategy: FileLoggerStrategy) {
    super(strategy);
  }

  createLogger() {
    return this.strategy.createLogger();
  }
}