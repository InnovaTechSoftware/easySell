import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
import { LoggerService } from 'src/logger/logger.service';
import { Controller, Get } from '@nestjs/common';
import { PostgresHealthIndicator } from './postgres.health';
import {MemoryHealthIndicator} from './memory.health';
import {DiskHealthIndicator} from './disk.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private redis: RedisHealthIndicator,
    private postgres: PostgresHealthIndicator,
    private logger: LoggerService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    try {
      const result = await this.health.check([
        () => this.redis.checkHealth('redis'),
        () => this.postgres.checkHealth('postgres'),
        () => this.memory.checkHealth('memory'),
        () => this.disk.checkHealth('disk'),
      ]);

      this.logger.getLogger().info('Health check complete successfully');
      return this.formatHealthCheckResult(result);
    } catch (error) {
      this.logger.getLogger().error('Health check failed', error);
      return this.formatHealthCheckResult(error.response);
    }
  }

  private formatHealthCheckResult(result: any) {
    const formattedResult: any = { status: result.status, services: [] };

    // Manejar servicios saludables
    if (result.info) {
      for (const [key, details] of Object.entries(result.info)) {
        formattedResult.services.push({
          name: key,
          status: 'up',
          ...(typeof details === 'object' && details !== null ? details : {}),
        });
      }
    }

    // Manejar servicios con errores
    if (result.error) {
      for (const [key, details] of Object.entries(result.error)) {
        formattedResult.services.push({
          name: key,
          status: 'down',
          ...(typeof details === 'object' && details !== null ? details : {}),
        });
      }
    }

    return formattedResult;
  }

  @Get('redis')
  @HealthCheck()
  async checkRedis() {
    try {
      const result = await this.health.check([
        () => this.redis.checkHealth('redis'),
      ]);
      this.logger.getLogger().info('Redis health check complete successfully');
      return this.formatHealthCheckResult(result);
    } catch (error) {
      this.logger.getLogger().error('Health check failed', error);
      return this.formatHealthCheckResult(error.response);
    }
  }

  @Get('postgres')
  @HealthCheck()
  async checkPostgres() {
    try {
      const result = await this.health.check([
        () => this.postgres.checkHealth('postgres'),
      ]);
      this.logger
        .getLogger()
        .info('Postgres health check complete successfully');
      return this.formatHealthCheckResult(result);
    } catch (error) {
      this.logger.getLogger().error('Health check failed', error);
      return this.formatHealthCheckResult(error.response);
    }
  }

  @Get('memory')
  @HealthCheck()
  async checkMemory() {
    try {
      const result = await this.health.check([
        () => this.memory.checkHealth('memory'),  // Verifica la salud de la memoria
      ]);
      this.logger.getLogger().info('Memory health check complete successfully');
      return this.formatHealthCheckResult(result);
    } catch (error) {
      this.logger.getLogger().error('Memory health check failed', error);
      return this.formatHealthCheckResult(error.response);
    }
  }

  @Get('disk')
  @HealthCheck()
  async checkDisk() {
    try {
      const result = await this.health.check([
        () => this.disk.checkHealth('disk'),  // Verifica la salud del disco
      ]);
      this.logger.getLogger().info('Disk health check complete successfully');
      return this.formatHealthCheckResult(result);
    } catch (error) {
      this.logger.getLogger().error('Disk health check failed', error);
      return this.formatHealthCheckResult(error.response);
    }
  }


}
