import { Logger } from 'winston';
import { LoggerStrategy } from '../interfaces/logger-strategy.interface';

export abstract class LoggerFactory {
  protected strategy: LoggerStrategy;

  constructor(strategy: LoggerStrategy) {
    this.strategy = strategy;
  }

  abstract createLogger(): Logger;
}