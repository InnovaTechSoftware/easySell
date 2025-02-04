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
}
