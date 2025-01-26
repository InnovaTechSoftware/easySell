import { Module } from '@nestjs/common';
import { RedisClientService } from './clients/redisClient';
import { LoggerService } from 'src/logger/logger.service';
import { CacheManagerService } from './cache.service';
import { LoggingModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggingModule],
  providers: [
    LoggerService,
    {
      provide: RedisClientService,
      useFactory: (loggerService: LoggerService) => {
        return new RedisClientService(loggerService, {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD,
        });
      },
      inject: [LoggerService], // Mover esta línea aquí
    },
    CacheManagerService,
  ],
  exports: [RedisClientService, CacheManagerService],
})
export class RedisModule {}
