import { Injectable } from '@nestjs/common';
import { LoggerFactory } from '../abstract-factories/logger-factory.abstract';
import { DailyRotateLoggerStrategy } from '../strategies/daily-rotate-logger.strategy';

@Injectable()
export class DailyRotateLoggerFactory extends LoggerFactory {
  constructor(strategy: DailyRotateLoggerStrategy) {
    super(strategy);
  }

  createLogger() {
    return this.strategy.createLogger();
  }
}