import { Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LoggerStrategySelector } from './strategies/logger-strategy.selector';

@Injectable()
export class LoggerService {
  private logger: Logger;

  constructor(private loggerStrategySelector: LoggerStrategySelector) {
    const strategy = this.loggerStrategySelector.selectStrategy();
    this.logger = strategy.createLogger();
  }

  getLogger(): Logger {
    return this.logger;
  }
}
