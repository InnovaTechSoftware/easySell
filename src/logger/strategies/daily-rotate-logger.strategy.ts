import { LoggerStrategy } from '../interfaces/logger-strategy.interface';
import { createLogger, transports, format } from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DailyRotateLoggerStrategy implements LoggerStrategy {
  createLogger() {
    return createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: path.join('logs', 'application-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp(),
            format.json()
          )
        })
      ]
    });
  }
}