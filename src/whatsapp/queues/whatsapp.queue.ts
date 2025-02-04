import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { LoggerService } from 'src/logger/logger.service';
import { Queue } from 'src/queues/abstract-queue';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RedisClientService } from 'src/cache-handler/clients/redisClient';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserAwareQueue } from 'src/queues/user-aware.queue';

@Injectable()
export class WhatsAppQueue extends UserAwareQueue<User> {
  constructor(
    usersService: UsersService,
    logger: LoggerService,
    redisClientService: RedisClientService,
  ) {
    super(usersService, logger, redisClientService);
  }

  async process(): Promise<string> {
    const user = this.dequeue();

    const whatsAppLink = this.generateWhatsAppLink(user.phone);
    this.logger
      .getLogger()
      .info(`Chat asignado a ${user.name}: WhatsAppLink ${whatsAppLink}`);

    return whatsAppLink;
  }

  private generateWhatsAppLink(phone: string): string {
    return `https://wa.me/+57${phone}`;
  }
}
