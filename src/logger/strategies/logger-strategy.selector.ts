import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerStrategy } from '../interfaces/logger-strategy.interface';
import { ConsoleLoggerStrategy } from '../strategies/console-logger.strategy';
import { FileLoggerStrategy } from '../strategies/file-logger.strategy';
import { DailyRotateLoggerStrategy } from '../strategies/daily-rotate-logger.strategy';

@Injectable()
export class LoggerStrategySelector {
  constructor(
    private configService: ConfigService,
    private consoleStrategy: ConsoleLoggerStrategy,
    private fileStrategy: FileLoggerStrategy,
    private dailyRotateStrategy: DailyRotateLoggerStrategy,
  ) {}

  selectStrategy(): LoggerStrategy {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    // console.log(env);

    switch (env) {
      case 'development':
        return this.consoleStrategy;
      case 'production':
        return this.dailyRotateStrategy;
      default:
        return this.fileStrategy;
    }
  }
}
