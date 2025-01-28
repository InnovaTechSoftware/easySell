import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import {TerminusModule} from '@nestjs/terminus';
import {RedisModule} from 'src/cache-handler/cache-handler.module';
import {LoggingModule} from 'src/logger/logger.module';
import {RedisHealthIndicator} from './redis.health';
import {PostgresHealthIndicator} from './postgres.health';
import {MemoryHealthIndicator} from './memory.health';
import {DiskHealthIndicator} from './disk.health';

@Module({
  imports:[
    TerminusModule,
    RedisModule,
    LoggingModule
  ],
  controllers: [HealthController],
  providers: [
    RedisHealthIndicator,
    PostgresHealthIndicator,
    MemoryHealthIndicator,
    DiskHealthIndicator
  ],
})
export class HealthModule {}
