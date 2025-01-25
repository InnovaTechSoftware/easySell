import { Injectable } from '@nestjs/common';
import { LoggerFactory } from '../abstract-factories/logger-factory.abstract';
import { ConsoleLoggerStrategy } from '../strategies/console-logger.strategy';

@Injectable()
export class ConsoleLoggerFactory extends LoggerFactory {
  constructor(strategy: ConsoleLoggerStrategy) {
    super(strategy);
  }

  createLogger() {
    return this.strategy.createLogger();
  }
}