import { Logger } from "winston";

export interface LoggerStrategy {
  createLogger(): Logger;
}