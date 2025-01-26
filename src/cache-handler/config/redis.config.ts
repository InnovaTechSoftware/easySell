import { RedisConfiguration } from '../interfaces/cache-hander.interface';

export class RedisConfig implements RedisConfiguration {
  constructor(
    public host: string,
    public port: number,
    public password?: string,
    public database?: number,
  ) {}

  getConectionURL(): string {
    return `redis://${this.host}:${this.port}`;
  }
}
