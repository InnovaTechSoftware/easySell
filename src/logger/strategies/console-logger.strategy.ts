import {Injectable} from "@nestjs/common";
import {createLogger, transports, format} from "winston"
import {LoggerStrategy} from "../interfaces/logger-strategy.interface";

@Injectable()
export class ConsoleLoggerStrategy implements LoggerStrategy {
  createLogger() {
    return createLogger({
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => 
              `${timestamp} [${level}]: ${message}`)
          )
        })
      ]
    });
  }
}
