import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsoleLoggerStrategy } from './strategies/console-logger.strategy';
import { FileLoggerStrategy } from './strategies/file-logger.strategy';
import { DailyRotateLoggerStrategy } from './strategies/daily-rotate-logger.strategy';
import { ConsoleLoggerFactory } from './factories/console-logger.factory';
import { FileLoggerFactory } from './factories/file-logger.factory';
import { DailyRotateLoggerFactory } from './factories/daily-rotate-logger.factory';
import { LoggerStrategySelector } from './strategies/logger-strategy.selector';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    ConsoleLoggerStrategy,
    FileLoggerStrategy,
    DailyRotateLoggerStrategy,
    ConsoleLoggerFactory,
    FileLoggerFactory,
    DailyRotateLoggerFactory,
    ConfigService, // Agregado
    LoggerStrategySelector,
    LoggerService,
  ],
  exports: [
    ConsoleLoggerStrategy,
    FileLoggerStrategy,
    DailyRotateLoggerStrategy,
    ConsoleLoggerFactory,
    FileLoggerFactory,
    DailyRotateLoggerFactory,
    LoggerStrategySelector,
    LoggerService,
  ],
})
export class LoggingModule {}
