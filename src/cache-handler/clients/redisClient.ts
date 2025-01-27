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
  private readonly MAX_RETRY_ATTEMPTS = 5;
  private retryCount = 0;


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
    await this.initializeClient();
  }

 
  async onModuleDestroy() {
    try {
      await this.client?.quit();
      this.logger.info('Redis client successfully disconnected');
    } catch (error) {
      this.logger.error('Error while disconnecting Redis client:', error);
    }
  }

  
  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    return this.client;
  }

  
  async isHealthy(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return false;
    }
  }

 
  private async initializeClient() {
    try {
      this.client = createClient({
        url: this.config.getConectionURL(),
        socket: {
          connectTimeout: 10000, // 10 secgundos
          reconnectStrategy: (retries) => {
            if (retries > this.MAX_RETRY_ATTEMPTS) {
              this.logger.error(
                `Maximum retry attempts (${this.MAX_RETRY_ATTEMPTS}) reached`,
              );
              return new Error('Maximum retry attempts reached');
            }
            const delay = Math.min(retries * 1000, 5000);
            this.logger.info(`Retrying connection in ${delay}ms...`);
            return delay;
          },
        },
      });

      
      this.setupEventHandlers();
      await this.client.connect();
      this.logger.info('Redis client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Redis client:', error);
      if (this.retryCount < this.MAX_RETRY_ATTEMPTS) {
        this.retryCount++;
        this.logger.info(
          `Retrying initialization (attempt ${this.retryCount}/${this.MAX_RETRY_ATTEMPTS})`,
        );
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.initializeClient();
      } else {
        throw new Error(
          `Failed to initialize Redis client after ${this.MAX_RETRY_ATTEMPTS} attempts`,
        );
      }
    }
  }


  private setupEventHandlers() {
    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      this.logger.info('Redis Client Connected Successfully');
      this.retryCount = 0; 
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis Client Reconnecting...');
    });

    this.client.on('end', () => {
      this.logger.info('Redis Client Connection Closed');
    });

    process.on('SIGINT', async () => {
      await this.onModuleDestroy();
      process.exit(0);
    });
  }
}