import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import { RedisConfig } from '../config/redis.config';
import { RedisConfiguration } from '../interfaces/cache-hander.interface';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private config: RedisConfig;
  private logger;

  constructor(
    private loggerService: LoggerService,
    config?: Partial<RedisConfiguration>,
  ) {
    this.config = new RedisConfig(
      config?.host,
      config?.port,
      config?.password,
      config?.database,
    );
    this.logger = this.loggerService.getLogger();
  }

  async onModuleInit() {
    try {
      this.client = createClient({
        url: this.config.getConectionURL(),
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        this.logger.info('Redis Client Connected Successfully');
      });

      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to initialize Redis client:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
