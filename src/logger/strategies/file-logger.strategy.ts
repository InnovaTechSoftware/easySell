import { Injectable } from "@nestjs/common";
import { createLogger, transports, format } from "winston"
import { LoggerStrategy } from "../interfaces/logger-strategy.interface";
import * as path from 'path';

@Injectable()
export class FileLoggerStrategy implements LoggerStrategy{
    createLogger() {
        return createLogger({
        transports: [
            new transports.File({
            filename: path.join(__dirname, '../../../logs/app.log'),
            format: format.combine(
                format.timestamp(),
                format.json()
            )
            })
        ]
        });
    }


}