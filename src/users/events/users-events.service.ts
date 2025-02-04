import { Injectable } from '@nestjs/common';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';
import { User } from '../entities/user.entity';

@Injectable()
export class UserEventsService {
  constructor(private readonly redisClientService: RedisClientService) {}

  async publishUserCreated(user: User) {
    const redisClient = this.redisClientService.getClient();
    await redisClient.publish('user:created', JSON.stringify(user));
  }
  async publishUserUpdated(user: User) {
    const redisClient = this.redisClientService.getClient();
    await redisClient.publish('user:update', JSON.stringify(user));
  }
  async publishUserDeleted(userId: number) {
    const redisClient = this.redisClientService.getClient();
    await redisClient.publish('user:deleted', JSON.stringify({ id: userId }));
  }
}
