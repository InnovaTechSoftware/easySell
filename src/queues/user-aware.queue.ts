import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue } from './abstract-queue';
import { User } from 'src/users/entities/user.entity';
import { RedisClientType } from 'redis';
import { UsersService } from 'src/users/users.service';
import { LoggerService } from 'src/logger/logger.service';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';

export abstract class UserAwareQueue<T>
  extends Queue<T>
  implements OnModuleInit, OnModuleDestroy
{
  protected users: User[] = [];
  protected currentUserIndex: number = 0;
  private subscriberClient: RedisClientType;

  constructor(
    protected readonly usersService: UsersService,
    protected readonly logger: LoggerService,
    protected readonly redisClientService: RedisClientService,
  ) {
    super();
  }

  async onModuleInit() {
    this.subscriberClient = this.redisClientService.getSubscriberClient();
    await this.refreshUsers();

    const events = ['user:created', 'user:updated', 'user:deleted'];

    for (const event of events) {
      await this.subscriberClient.subscribe(event, async () => {
        this.logger
          .getLogger()
          .info(`Evento ${event} recibido, actualizando lista`);
        await this.refreshUsers();
      });
    }
  }

  async onModuleDestroy() {
    if (this.subscriberClient) {
      await this.subscriberClient.unsubscribe('user:created');
    }
  }

  public peekNextUser(): User | null {
    if (this.users.length === 0) {
      this.logger.getLogger().warn('No hay usuarios disponibles');
      return null;
    }
    return this.users[this.currentUserIndex];
  }

  public getNextUser(): User {
    const user = this.users[this.currentUserIndex];
    this.currentUserIndex = (this.currentUserIndex + 1) % this.users.length;
    return user;
  }

  async refreshUsers(): Promise<void> {
    this.users = await this.usersService.findAll();
    this.currentUserIndex = 0;
  }
}
