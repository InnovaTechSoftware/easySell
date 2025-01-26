import { Inject, Injectable } from '@nestjs/common';
import { RedisClientService } from './clients/redisClient';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(RedisClientService)
    private readonly redisService: RedisClientService,
  ) {}

  async set(
    key: string,
    value: string,
    options?: {
      ttl?: number;
      nx?: boolean;
      xx?: boolean;
    },
  ): Promise<boolean> {
    const client = this.redisService.getClient();
    const setOptions = {
      ...(options?.ttl && { EX: options.ttl }),
      ...(options?.nx && { NX: options.nx }),
      ...(options?.xx && { XX: options.xx }),
    };
    const result = await client.set(key, value, setOptions as any);
    return result === 'OK';
  }

  async get(key: string): Promise<string | null> {
    const client = this.redisService.getClient();
    return await client.get(key);
  }

  async delete(key: string): Promise<number> {
    const client = this.redisService.getClient();
    return await client.del(key);
  }

  async incrementCounter(key: string, increment = 1): Promise<number> {
    const client = this.redisService.getClient();
    return await client.incrBy(key, increment);
  }

  async setExpiration(key: string, seconds: number): Promise<boolean> {
    const client = this.redisService.getClient();
    return await client.expire(key, seconds);
  }
}
