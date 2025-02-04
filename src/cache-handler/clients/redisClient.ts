import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { RedisConfig } from '../config/redis.config';
import { LoggerService } from 'src/logger/logger.service';
import { RedisConfiguration } from '../interfaces/cache-hander.interface';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private subscriberClient: RedisClientType;
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
    await this.initializeSubscriberClient();
  }

  async onModuleDestroy() {
    try {
      await this.client?.quit();
      await this.subscriberClient?.quit();
      this.logger.info('Redis clients successfully disconnected');
    } catch (error) {
      this.logger.error('Error while disconnecting Redis clients:', error);
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

  getSubscriberClient(): RedisClientType {
    if (!this.subscriberClient) {
      throw new Error('Redis subscriber client not initialized');
    }
    return this.subscriberClient;
  }

  private async initializeClient() {
    try {
      this.client = createClient({
        url: this.config.getConectionURL(),
        password: this.config.password,
        database: this.config.database,
        socket: {
          connectTimeout: 10000,
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

      this.setupEventHandlers(this.client, 'Publisher');
      await this.client.connect();
      // this.logger.info('Redis publisher client initialized successfully');
    } catch (error) {
      // this.logger.error('Failed to initialize Redis publisher client:', error);
      if (this.retryCount < this.MAX_RETRY_ATTEMPTS) {
        this.retryCount++;
        this.logger.info(
          `Retrying initialization (attempt ${this.retryCount}/${this.MAX_RETRY_ATTEMPTS})`,
        );
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.initializeClient();
      } else {
        throw new Error(
          `Failed to initialize Redis publisher client after ${this.MAX_RETRY_ATTEMPTS} attempts`,
        );
      }
    }
  }

  private async initializeSubscriberClient() {
    try {
      this.subscriberClient = createClient({
        url: this.config.getConectionURL(),
        password: this.config.password,
        database: this.config.database,
        socket: {
          connectTimeout: 10000,
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

      this.setupEventHandlers(this.subscriberClient, 'Subscriber');
      await this.subscriberClient.connect();
      // this.logger.info('Redis subscriber client initialized successfully');
    } catch (error) {
      // this.logger.error('Failed to initialize Redis subscriber client:', error);
      throw error;
    }
  }

  private setupEventHandlers(client: RedisClientType, clientType: string) {
    client.on('error', (err) => {
      this.logger.error(`Redis ${clientType} Client Error:`, err);
    });
    client.on('connect', () => {
      this.logger.info(`Redis ${clientType} Client Connected Successfully`);
      if (clientType === 'Publisher') {
        this.retryCount = 0;
      }
    });
    client.on('reconnecting', () => {
      this.logger.warn(`Redis ${clientType} Client Reconnecting...`);
    });
    client.on('end', () => {
      this.logger.info(`Redis ${clientType} Client Connection Closed`);
    });
  }
}
