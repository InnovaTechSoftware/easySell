// health/postgres.health.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import {Connection} from 'mysql2/typings/mysql/lib/Connection';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  constructor(private dataSource: DataSource) {
    super();
  }

  async checkHealth(key: string): Promise<HealthIndicatorResult> {
    try {

      await this.dataSource.query('SELECT 1');
      return this.getStatus(key, true, {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DATABASE,
      });
    } catch (error) {
      const result = this.getStatus(key, false, {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DATABASE,
        error: error.message,
      });
      throw new HealthCheckError('Postgres check failed', result);
    }
  }
}
