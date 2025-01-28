import {Injectable} from "@nestjs/common";
import {HealthCheckError, HealthIndicator, HealthIndicatorResult} from "@nestjs/terminus";
import {RedisClientService} from "src/cache-handler/clients/redisClient";
import {LoggerService} from "src/logger/logger.service";

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    private redisService: RedisClientService,
    private logger: LoggerService
    ) {
    super();
  }

  async checkHealth(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.redisService.isHealthy();
      const result = this.getStatus(key, isHealthy, {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        database: process.env.REDIS_DATABASE,
      });

      if (!isHealthy) {
        throw new HealthCheckError(
          'Redis check failed',
          result
        );
      }

      return result;
    } catch (error) {
      return this.getStatus(key, false, {
        error: error.message,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        database: process.env.REDIS_DATABASE,
      });
    }
  }
}